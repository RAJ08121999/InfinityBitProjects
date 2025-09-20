import { createFileRoute } from '@tanstack/react-router'
import PupilsList from '@/pages/pupils/PupilsList';

export const Route = createFileRoute('/pupils/')({
  component: PupilsList,
})

