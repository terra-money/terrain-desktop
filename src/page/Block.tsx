import BlockView from "./BlockView";
import { useGetBlocks } from "../package"

export default function BlockPage() {
  const { blocks } = useGetBlocks()
    return <ul className="w-full flex flex-col">
      {blocks.map(b => (<BlockView block={b}/>))}
  </ul>
} 