import { createFileRoute } from '@tanstack/react-router'
import PupilAdd from '@/pages/pupils/PupilAdd';

export const Route = createFileRoute('/pupils/add')({
  component: PupilAdd,
})

