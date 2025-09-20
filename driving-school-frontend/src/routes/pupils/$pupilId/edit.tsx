import { createFileRoute } from '@tanstack/react-router'
import PupilEdit from '@/pages/pupils/PupilEdit';

export const Route = createFileRoute('/pupils/$pupilId/edit')({
  component: PupilEdit,
})

