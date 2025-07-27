import dynamic from 'next/dynamic'

const KanbanClient = dynamic(() => import('./KanbanClient'), { ssr: false })

export default function KanbanPage() {
  return <KanbanClient />
}
