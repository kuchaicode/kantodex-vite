interface Props {
    type: "normal" | "fire" | "water" | "electric" | "grass" | "ice" | "fighting" | "poison" | "ground" | "flying" | "psychic" | "bug" | "rock" | "ghost" | "dragon" | "dark" | "steel" | "fairy"
}

const typeStyles = {
    "normal": "bg-gray-500",
    "fire": "bg-orange-500",
    "water": "bg-blue-500",
    "electric": "bg-yellow-500",
    "grass": "bg-green-500",
    "ice": "bg-blue-300",
    "fighting": "bg-red-700",
    "poison": "bg-fuchsia-600",
    "ground": "bg-amber-200",
    "flying": "bg-blue-200",
    "psychic": "bg-fuchsia-400",
    "bug": "bg-lime-500",
    "rock": "bg-yellow-700",
    "ghost": "bg-purple-950",
    "dragon": "bg-indigo-600",
    "dark": "bg-gray-700",
    "steel": "bg-gray-200",
    "fairy": "bg-fuchsia-200",
}

export default function TypeBadge({type}: Props) {

    return (
        <div className={`text-white text-xs rounded-sm py-1 px-3 mx-1 text- ${typeStyles[type]}`} style={{"textShadow": "1px 1px 1px gray"}}>
            {type.toUpperCase()}
        </div>
    )} 