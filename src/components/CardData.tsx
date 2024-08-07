"use client";
import { useCallback } from 'react';
import React, { useState, useEffect } from 'react';
import { LucideList, LucideGrid, LucideAlbum, LucideHouse } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card"  
import { Button } from "./ui/button"
import { Skeleton } from "./ui/skeleton"
import axios from 'axios';
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
// import { useSearchParams } from 'next/navigation';
import { Link, redirect, useSearchParams } from "react-router-dom";
import PokeModal from '../modals/PokeModal';
import { getLocalStorage } from '../hooks/useLocalStorage';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs'
import { LucideBadgeCheck, LucideBadge } from 'lucide-react';
import capitalizeFirstLetter from '@/lib/capitalizeFirstLetter';

// type Props = {
//   name:string
//   url:string
// }


const fetchPokemon = async ({ pageParam = 0 }) => {
  const limit = pageParam >= 140 ? 11 : 20;
  const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${pageParam}&limit=${limit}`);
  return response.data;
};
// pageParam = from Tanstack Query, needed for InfiniteQuery
// Uses offset and limit here
// Limit: on 140th load 11 to stop properly in Gen1
  

export default function CardData() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [displayData, setDisplayData] = useState<any>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'owned'>('all'); 
  const [updateData, setUpdateData] = useState(false)
  let [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const isSearchEmpty = !search || search.length === 0;

  const isUpdateData = () => {
    setUpdateData(!updateData)
  }

  const createQueryString = useCallback(
    (name: string, value: string) => {
      // const params = new URLSearchParams(searchParams?.toString());
      // params.set(name, value);
      // setSearchParams(`${name}=${value}`)
      // return params.toString();
      return redirect(`/${value}`)
    },
    [searchParams]
  );
// Added to access modal through search params

  const { data: completeData } = useQuery({
  queryKey: ['pokemonList', search],
  queryFn: async () => {
    const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=151");
    return response.data;
  },
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ['pokemonList'],
    queryFn: fetchPokemon,
    getNextPageParam: (lastPage, allPages) => {
      const totalItemsFetched = allPages.reduce((acc, page) => acc + page.results.length, 0);
      if (totalItemsFetched >= 150) {
        return undefined;
      }
      const nextPageOffset = lastPage.next ? new URL(lastPage.next).searchParams.get('offset') : undefined;
      return nextPageOffset !== undefined ? parseInt(nextPageOffset || '', 10) : undefined;
      // using OR for fallback value when nextPageOffset is null. This ensures it is read as a string...
    },
    initialPageParam: 0, 
    // initialPageParam value necessary to function at all
  });

  // useEffect for search because infinite load...
  useEffect(() => {
    let rawData: Array<{name:string, url:string}> = []
    isSearchEmpty ?
      rawData = data?.pages.flatMap(page => page.results) as Array<{name:string, url:string}> :
      rawData = completeData?.results as Array<{name:string, url:string}>
    setDisplayData(rawData?.map((item, i) => {
      const customData = getLocalStorage(item?.name || "")
      return { ...item, id: i+1, captureData:customData }
    }))
  }, [search, data, completeData, isSearchEmpty, updateData]);
// empty = incomplete data since incomplete = not fully loaded pokemon (the usual)
// not empty = search from all


  // Node: HTMLelement, else doesnt compile
  const loadMoreRef = useCallback((node: HTMLElement | null) => {
    if (!node || isLoading || !hasNextPage) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

  
    if (node) observer.observe(node);
    return () => observer.disconnect();
  }, [isLoading, hasNextPage, fetchNextPage]);
//  Intersection Observer end (for infinite load to work)

  if (isLoading && !isFetching) {
  return (
    <div className="flex pt-4 align-middle justify-center">
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[250px] w-[500px] rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[500px]" />
          <Skeleton className="h-4 w-[400px]" />
        </div>
      </div>
    </div>
  );
  }

  if (isError) {
  console.error("Error! :( Please check:", isError);
  return <span>Error loading data!</span>;
  }

//  checks for datecaptured's presence to check if owned or not 
const isOwned = (pokemon: any) => {
  return pokemon.captureData.dateCaptured ? true : false;
};

// filter based on displaydata on own status for staggered loading for infinite load
const filteredData = displayData?.filter((pokemon: any) => {
  // console.log(pokemon)
  if (activeTab === 'owned') {
    return isOwned(pokemon); 
  }
  return true; 
});
// return true : show all 



return (
  <>
    <div className='absolute flex justify-end top-2 right-5 mt-2 mr-2'>
      <Button onClick={() => setView(view === 'grid' ? 'list' : 'grid')} className="rounded-md text-xs">
        <span className='hidden md:inline'>{capitalizeFirstLetter(view)}</span>{view === 'grid' ? <LucideGrid className='ml-2' /> : <LucideList className='ml-2' />}
      </Button>
    </div>
    <Tabs defaultValue="all" className="mx-auto flex flex-col flex-grow">
      <TabsList className='w-3/4 p-8 mx-auto border border-rose-50 border-opacity-20'>
        <TabsTrigger value="all" className='flex flex-grow py-4 px-12' onClick={() => setActiveTab('all')}>
          <LucideAlbum className='mr-2' />All
        </TabsTrigger>
        <TabsTrigger value="owned" className='flex flex-grow py-4 px-12' onClick={() => setActiveTab('owned')}>
          <LucideHouse className='mr-2' />Owned
        </TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <div className={`container mx-auto ${view === 'grid' ? 'grid grid-cols-2 lg:grid-cols-4 gap-4 w-3/4' : 'flex flex-col w-1/2'}`}>
          {filteredData?.map((pokemon: any, index: number) => (
            (pokemon.name.includes(search.toLowerCase()) || isSearchEmpty) && (
              <Link onClick={createQueryString('pokemon', pokemon.name)} key={pokemon.name} >
                <Card
                  className={`border border-rose-400 bg-gray-800 ${view === 'list' ? 'flex items-center mb-2' : ''}`}
                  ref={index === filteredData.length - 1 ? loadMoreRef : null}
                >
                  {view === 'list' && (
                    <img
                      className='m-4'
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                      width={100}
                      height={100}
                      alt={`${pokemon.name} sprite`}
                    />
                  )}
                  <div className={`${view === 'list' ? 'flex-auto pt-10' : ''}`}>
                    <CardHeader>
                      <CardTitle className="h-10">
                        <h3 className='text-gray-100 text-sm md:text-xl'><span className='text-gray-300 mr-2'>{pokemon.id}</span>{capitalizeFirstLetter(pokemon.name || '')}</h3>
                        {pokemon?.captureData && <div className="ml-4 mt-1 text-gray-100 text-xs md:text-sm italic">{`${pokemon?.captureData?.name}`}</div>}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className={`align-middle p-3 m-3 border-2 border-black-200 rounded-xl ${view === 'list' ? 'bg-transparent border-none' : 'bg-gray-50'}`}>
                      {view === 'grid' && (
                        <img
                          className='mx-auto'
                          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                          width={150}
                          height={150}
                          alt={`${pokemon.name} sprite`}
                        />
                      )}
                    </CardContent>
                  </div>
                  <CardFooter>
                  <span className={`mr-2 ${isOwned(pokemon) ? 'text-green-400' : 'text-gray-300'} items-center justify-center align`}>
                    {isOwned(pokemon) ? <LucideBadgeCheck /> : <LucideBadge />} 
                  </span>
                  </CardFooter>
                </Card>
              </Link>
            )
          ))}
          {searchParams?.get('pokemon') && <PokeModal pokemon={searchParams.get('pokemon') || ''} isUpdateData={isUpdateData} />}
        </div>
      </TabsContent>
      <TabsContent value="owned">
       <div className={`container mx-auto ${view === 'grid' ? 'grid grid-cols-2 lg:grid-cols-4 gap-4 w-3/4' : 'flex flex-col w-1/2'}`}>
          {filteredData?.map((pokemon: any, index: number) => (
            isOwned(pokemon) && (pokemon.name.includes(search.toLowerCase()) || isSearchEmpty) && (
              <Link onClick={() => redirect(`/${createQueryString('pokemon', pokemon.name)}`)} key={pokemon.name} >
                <Card
                  className={`border border-rose-400 bg-gray-800 ${view === 'list' ? 'flex items-center mb-2' : ''}`}
                  ref={index === filteredData.length - 1 ? loadMoreRef : null}
                >
                  {view === 'list' && (
                    <img
                      className='m-4'
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                      width={100}
                      height={100}
                      alt={`${pokemon.name} sprite`}
                    />
                  )}
                  <div className={`${view === 'list' ? 'flex-auto pt-10' : ''}`}>
                    <CardHeader>
                      <CardTitle className="h-10">
                        <h3 className='text-gray-100 text-sm md:text-xl'><span className='text-gray-300 mr-2'>{pokemon.id}</span>{capitalizeFirstLetter(pokemon.name)}</h3>
                        {pokemon?.captureData && <div className="ml-4 mt-1 text-gray-100 text-sm italic">{`${pokemon?.captureData?.name}`}</div>}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className={`align-middle p-3 m-3 border-2 border-black-200 rounded-xl ${view === 'list' ? 'bg-transparent border-none' : 'bg-gray-50'}`}>
                      {view === 'grid' && (
                        <img
                          className='mx-auto'
                          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                          width={150}
                          height={150}
                          alt={`${pokemon.name} sprite`}
                        />
                      )}
                    </CardContent>
                  </div>
                  <CardFooter>
                  <span className={`mr-2 ${isOwned(pokemon) ? 'text-green-400' : 'text-gray-300'} items-center justify-center align`}>
                    {isOwned(pokemon) ? <LucideBadgeCheck /> : <LucideBadge />} 
                  </span>
                  </CardFooter>
                </Card>
              </Link>
            )
          ))}
          {searchParams?.get('pokemon') && <PokeModal pokemon={searchParams.get('pokemon') || ''} isUpdateData={isUpdateData} />}
        </div>
      </TabsContent>
    </Tabs>

</>
);
        }

