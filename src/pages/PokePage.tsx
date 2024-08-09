"use client"

import { useLocation } from "react-router-dom" ;
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { Button } from "@/components/ui/button";
import { Skeleton } from "..//components/ui/skeleton";
import { LucideBadgeCheck } from "lucide-react";
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

// interface localData {
//     pokemon:string
//     isUpdateData: (data: object) => void;
//   }


const PokePage = () => {
    const { pathname} = useLocation();
    const pokemonName = pathname.slice(1);
    // NEW, react router dom routing
    const [value, setValue] = useLocalStorage (`${pokemonName}`, {});
    const [myPokemon, setMyPokemon] = useState({ name: "", dateCaptured: "" });
    // Note: Removed set/isSaved for checking saved status


    const { isLoading, data } = useQuery({
        queryKey: ['pokemon', pokemonName],
        queryFn: async () => {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        return response.data;
        },
    });
    //   useQuery, axios

    // resetting nickname and date. setIsOpen is for the alert/confirmation. 
const deleteCaptureData = (e: any) => {
    e.preventDefault()
    setMyPokemon({ name: "", dateCaptured: "" })
    setValue({})
    localStorage.removeItem(`${pokemonName}`)
    setIsOpen(false);
}
// Close on data deletion

//   check if value is present, then sets
    useEffect(() => {
        try {
        if (value.name && value.dateCaptured) {
            setMyPokemon(value);
        }
        } catch (error) {
        console.error("localStorage error!", error);
        }
    }, [value]);

    // also try React.MouseEvent<HTMLButtonElement> for the event's type
    const saveToLocalStorage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const currentDate = new Date().toISOString().split("T")[0]; 
        const serializedData = {
            name: myPokemon.name,
            dateCaptured: myPokemon.dateCaptured || currentDate, 
        };
        setValue(serializedData);
    };

    // For stats graph
    const pokemonStats = data?.stats?.map((item: any) => 
        {return {stat: item?.stat?.name.toUpperCase(), base_stat: item?.base_stat || 100}
        }
    )

    // console.log(data?.types)

    const [isOpen, setIsOpen] = useState(false)

  return (
<div className="flex items-center justify-center overflow-y-auto bg-stone-50 dark:bg-slate-900">
    <div className="p-8 border-gray-300 dark:border-slate-600 border-2 w-[60rem] dark:bg-gray-800 bg-gray-100 rounded-lg overflow-y-auto ">
        <div className="flex justify-start mb-4">
            <Link
                to={`/`}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 active:bg-rose-800 focus:ring-rose-300 text-white rounded-md shadow-sm focus:outline-none"
            >
                ⏴ Back
            </Link>
        </div>
        {/* Back button end */}
        <h1 className="text-center font-bold dark:text-gray-100">{capitalizeFirstLetter(pokemonName || "")} {(value.name && value.dateCaptured) && <LucideBadgeCheck className="inline text-green-400 mb-1" />}</h1>
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
        {(value.name && value.dateCaptured) && 
            <div className="mt-2 px-7 py-3 bg-gray-50 border border-gray-300 dark:border-gray-600 rounded-lg text-center dark:bg-gray-600">
                {value.name && 
                <p className="font-bold dark:text-gray-100">{`Nickname: ${value.name}`}</p>}
                {value.dateCaptured && 
                <p className="font-bold dark:text-gray-100">{`Caught: ${value.dateCaptured}`}</p>
            }
            </div>
        }
      {/* Name + Date Captured above */}
      {/* Form Start: */}
    <div className="flex justify-center items-center">
        {/* Center? */}
        <form onSubmit={(e) => saveToLocalStorage(e)} className="mt-4 mb-2 pt-4 rounded-xl dark:bg-gray-600 bg-gray-200 w-full max-w-md flex-col">
            <div className="flex flex-col">
                <div className="flex items-center mb-4 pl-6">
                <label htmlFor="pokemonName" className="text-sm font-medium dark:text-gray-100 mr-2">Nickname</label>
                <input
                    id="pokemonName"
                    className='border border-gray-300 rounded-lg px-4 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-rose-500'
                    value={myPokemon.name}
                    maxLength={25}
                    required
                    onChange={e => setMyPokemon({ ...myPokemon, name: e.target.value })}
                />
                </div>
            </div>
            <div className="flex items-center mb-4 pl-6">
                <label htmlFor="pokemonCaptureDate" className="text-sm font-medium dark:text-gray-100 mr-3">Captured</label>
                <input
                    id="pokemonCaptureDate"
                    type="date"
                    className='border border-gray-300 rounded-lg px-4 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-rose-500'
                    value={myPokemon.dateCaptured || new Date().toISOString().split("T")[0]} 
                    onChange={e => setMyPokemon({ ...myPokemon, dateCaptured: e.target.value })}
                />
            {/* For UX reasons. Even without input: it defaults to current day, converted to ISO format then split from T onwards */}
            </div>
        <div className="flex space-x-4 justify-center">
            <div className="pb-2">
                <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                    <AlertDialogTrigger asChild>
                        <Button
                        type="button"
                        id="removePokemon"
                        className='mt-2 mb-4 px-4 py-2 bg-rose-800 font-medium rounded-md shadow-sm hover:bg-rose-700 border-2 border-dashed border-rose-500 active:bg-rose-900 dark:text-white'
                        >
                        Clear Data?
                        </Button>
                    </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Owned Pokemon Data?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure? This action cannot be undone. This will permanently delete your entered data!
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel className="text-white" onClick={() => setIsOpen(false)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={deleteCaptureData}>Delete Permanently</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                </AlertDialog>
            </div>
                <Button type="submit" className="mt-2 mb-4 px-4 py-2 bg-rose-600 hover:bg-rose-500 active:bg-rose-800 font-medium rounded-md shadow-sm focus:ring-2 focus:ring-rose-300 dark:text-white">Update Capture Info
                </Button>
            
        </div>
        </form>
    </div>
      {/* Form end */}
    <div className="justify-center">
        <hr />
        <div className="flex justify-around">
        <p className="p-2 dark:text-white"><span className="font-semibold">Height:</span> {(+data?.height / 10)} m</p> 
        <p className="p-2 dark:text-white"><span className="font-semibold">Weight:</span> {(+data?.weight/ 10)} kg</p>
        </div>  
        <StatsGraph data={pokemonStats}/>
        {/* Height and weight are divided because the API data provided is in hectograms */}
        
    </div>
      {/* PokeAPI data above */}
    </div>
</div>

)
}

export default PokePage