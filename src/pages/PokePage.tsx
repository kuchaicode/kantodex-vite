"use client"

import { useParams } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { Button } from "@/components/ui/button";
import { Skeleton } from "..//components/ui/skeleton";
import { LucideCircleArrowLeft, LucideBadgeCheck } from "lucide-react";
import StatsGraph from "../components/ui/graph";
import TypeBadge from "../components/TypeBadge";
import capitalizeFirstLetter from "@/lib/capitalizeFirstLetter";
import { Link } from "react-router-dom";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"



interface localData {
    pokemon:string
    isUpdateData: (data: object) => void;
  }
  

const PokePage = ({ pokemon, isUpdateData }: localData) => {
    const { name } = useParams<{ name: string }>(); 
    // NEW, react router dom
    const [value, setValue] = useLocalStorage(pokemon, {});
    const [myPokemon, setMyPokemon] = useState({ name: "", dateCaptured: "" });
    const [isSaved, setIsSaved] = useState(false);

    // usestate end

    const { isLoading, data } = useQuery({
        queryKey: ['pokemon', name],
        queryFn: async () => {
          const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
          return response.data;
        },
      });

    //   useQuery, axios


        
    // resetting nickname and date. setIsOpen is for the alert/confirmation. PLS FIX IT ISNT CLOSING THO but cancel works.
const deleteCaptureData = (e: any) => {
    e.preventDefault()
    setMyPokemon({ name: "", dateCaptured: "" })
    setValue({})
    localStorage.removeItem(pokemon)
    isUpdateData()
    setIsOpen(false);
  }
  
//   If both have values -> MyPokemon
    useEffect(() => {
      try {
        if (value.name && value.dateCaptured) {
          setMyPokemon(value);
          setIsSaved(true); 
        }
      } catch (error) {
        console.error("localStorage error!", error);
      }
    }, [value]);
  
    // also try React.MouseEvent<HTMLButtonElement> for the event's type
    const saveToLocalStorage = (e: React.FormEvent<HTMLInputElement>) => {
      e.preventDefault();
      const currentDate = new Date().toISOString().split("T")[0]; 
      const serializedData = {
        name: myPokemon.name,
        dateCaptured: myPokemon.dateCaptured || currentDate, 
      };
      setValue(serializedData);
      setIsSaved(true);
      isUpdateData()
    };
  
    // For stats graph
    const pokemonStats = data?.stats?.map((item: any, i: number) => 
      {return {stat: item?.stat?.name.toUpperCase(), base_stat: item?.base_stat || 100}})
  
    // console.log(data?.types)

    const [isOpen, setIsOpen] = useState(false)

  return (
<div className="h-full w-full flex items-center justify-center overflow-y-auto">
    <div className="p-8 border border-gray-300 w-[60rem] dark:bg-gray-800 bg-gray-100  max-h-[50rem] rounded-lg overflow-y-auto">
        <div className="flex justify-start mb-4">
            <Link
                to={`/`}
                className="px-4 py-2 bg-rose-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
                ⏴ Back
            </Link>
        </div>
        {/* Back button end */}
        <h4 className="text-center font-bold dark:text-gray-100">{capitalizeFirstLetter(pokemon || "")} {(value.name && value.dateCaptured) && <LucideBadgeCheck className="inline text-green-400 mb-1" />}</h4>
        {isLoading ? (
        <Skeleton className="h-[150px] w-[150px] rounded-xl mx-auto my-3 px-3 bg-slate-600" />
        ) : (
            <img 
            className='mx-auto'
            src={data?.sprites.front_default}
            width={150}
            height={150}
            alt={`${data?.name} sprite`}
            /> )}
      <span className="flex items-center justify-center">
        {data?.types.map(((item:any) => (
          <TypeBadge type={item?.type.name} key={item?.type.name} />
        )
        ))}
      </span>
      {
        (value.name && value.dateCaptured) && <div className="mt-2 px-7 py-3 border border-gray-300 rounded-lg">
        {value.name && <p className="text-lg font-bold dark:text-gray-100">{`Nickname: ${value.name}`}</p>}
        {value.dateCaptured && <p className="text-lg font-bold dark:text-gray-100">{`Caught on: ${value.dateCaptured}`}</p>
      }
    </div>}
      {/* Name + Date Captured */}
    <form onSubmit={saveToLocalStorage} className="mt-4 mb-2 pt-4 rounded-lg dark:bg-gray-600 bg-gray-300">
      <div className="flex items-center ml-10 mb-4">
        <label htmlFor="pokemonName" className="text-sm font-medium dark:text-gray-100 mr-2">Nickname</label>
        <input
            id="pokemonName"
            className='border border-gray-300 rounded-lg px-4 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-rose-500'
            value={myPokemon.name}
            maxLength={30}
            onChange={e => setMyPokemon({ ...myPokemon, name: e.target.value })}
        />
      </div>
      <div className="flex items-center ml-6 mb-4">
        <label htmlFor="pokemonCaptureDate" className="text-sm font-medium dark:text-gray-100 mr-2">Date Caught</label>
        <input
            id="pokemonCaptureDate"
            type="date"
            className='border border-gray-300 rounded-lg px-4 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-rose-500'
            value={myPokemon.dateCaptured || new Date().toISOString().split("T")[0]} 
            onChange={e => setMyPokemon({ ...myPokemon, dateCaptured: e.target.value })}
        />
        {/* Even without input: it defaults to current day, converted to ISO format then split from T onwards */}
      </div>
        <div className="flex space-x-4">
            <Button type="submit" className="mt-2 mb-4 px-4 py-2 bg-rose-600 font-medium rounded-md shadow-sm hover:bg-rose-500 focus:ring-2 focus:ring-rose-300">Update Capture Info</Button>
        <div className="pb-2">
            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                <AlertDialogTrigger asChild>
                    <Button
                    type="button"
                    id="removePokemon"
                    className='mt-2 mb-4 px-4 py-2 bg-rose-800 font-medium rounded-md shadow-sm hover:bg-rose-700 border-2 border-dashed border-rose-500'
                    >
                    Clear Data?
                    </Button>
                </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your Pokemon data!
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setIsOpen(false)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={deleteCaptureData}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
            </AlertDialog>
        </div>
      </div>
      </form>
      {/* Form end */}
      <div className="justify-center">
        <hr />
        <div className="flex justify-around">
        <p className="p-2"><span className="font-semibold">Height:</span> {(+data?.height / 10)} m</p> 
        <p className="p-2"><span className="font-semibold">Weight:</span> {(+data?.weight/ 10)} kg</p>
        </div>
        <StatsGraph data={pokemonStats} />
        {/* Height and weight are divided because the API data provided is in hectograms */}
        
      </div>
      {/* PokeAPI data above */}
    </div>
  </div>

  )
}

export default PokePage