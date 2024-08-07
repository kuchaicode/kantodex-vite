"use client";
import { Link} from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import useLocalStorage from "../hooks/useLocalStorage";
import { useState, useEffect } from "react";
import { Skeleton } from "..//components/ui/skeleton";
import { LucideX, LucideBadgeCheck } from "lucide-react";
// import Image from "next/image";
import StatsGraph from "../components/ui/graph"
// import { useRouter } from "next/navigation";
import TypeBadge from "../components/TypeBadge";
import capitalizeFirstLetter from "@/lib/capitalizeFirstLetter";


interface localData {
  pokemon:string
  isUpdateData: (data: object) => void;
}

export default function PokeModal({ pokemon, isUpdateData }: localData){
  // const router = useRouter();
  const [value, setValue] = useLocalStorage(pokemon, "");
  const [myPokemon, setMyPokemon] = useState({ name: "", dateCaptured: "" });
  const [isSaved, setIsSaved] = useState(false);

  const { isLoading, data } = useQuery({
    queryKey: ['pokemon', pokemon],
    queryFn: async () => {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
      return response.data;
    },
  });

// resetting nickname and date
const deleteCaptureData = (e: any) => {
  e.preventDefault()
  setMyPokemon({ name: "", dateCaptured: "" })
  setValue({})
  localStorage.removeItem(pokemon)
  isUpdateData()

}

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

  const pokemonStats = data?.stats?.map((item: any, i: number) => 
    {return {stat: item?.stat?.name.toUpperCase(), base_stat: item?.base_stat || 100}})

  console.log(data?.types)
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-[999999]">
      <div className="p-8 border border-gray-300 w-[40rem] shadow-lg rounded-lg bg-gray-800 relative max-h-[50rem] overflow-y-auto">
        <div className="flex justify-end">
          {/* <Link
            to={`/`}
            className="px-4 py-2 bg-rose-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <LucideX />
          </Link> */}
        </div>
        {/* Close button end */}
        <div className="text-center">
          <h4 className="text-2xl font-bold text-gray-100">{capitalizeFirstLetter(pokemon)} {(value.name && value.dateCaptured) && <LucideBadgeCheck className="inline text-green-400 mb-1" />}</h4>
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
            {value.name && <p className="text-lg font-bold text-gray-100">{`Nickname: ${value.name}`}</p>}
            {value.dateCaptured && <p className="text-lg font-bold text-gray-100">{`Caught on: ${value.dateCaptured}`}</p>
          }
        </div>}
          {/* Name + Date Captured */}
        <form onSubmit={saveToLocalStorage} className="mt-4 mb-2 pt-4 rounded-lg bg-gray-600">
          <div className="flex items-center ml-10 mb-4">
            <label htmlFor="pokemonName" className="text-sm font-medium text-gray-100 mr-2">Nickname</label>
            <input
              id="pokemonName"
              className='border border-gray-300 rounded-lg px-4 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-rose-500'
              value={myPokemon.name}
              maxLength={30}
              onChange={e => setMyPokemon({ ...myPokemon, name: e.target.value })}
            />
          </div>
          <div className="flex items-center ml-6 mb-4">
            <label htmlFor="pokemonCaptureDate" className="text-sm font-medium text-gray-100 mr-2">Date Caught</label>
            <input
              id="pokemonCaptureDate"
              type="date"
              className='border border-gray-300 rounded-lg px-4 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-rose-500'
              value={myPokemon.dateCaptured || new Date().toISOString().split("T")[0]} 
              onChange={e => setMyPokemon({ ...myPokemon, dateCaptured: e.target.value })}
              // onSubmit={HomeRefresh}
            />
            {/* Even without input: it defaults to current day, converted to ISO format then split from T onwards */}
          </div>
          <Button type="submit" className="mt-2 mb-4 px-4 py-2 bg-rose-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300">Update Capture Info</Button>
                      <div className="pb-2">
            <label htmlFor="removePokemon" className="text-sm font-medium text-gray-100 mr-2">Reset Data?</label>
              <Button
                type="submit"
                id="removePokemon"
                className='border bg-border-700 rounded-lg px-4 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-rose-500'
                value= {`Clear Data`}  
                onClick={deleteCaptureData}
              >Clear Data
              </Button>
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
    </div>
  );
}