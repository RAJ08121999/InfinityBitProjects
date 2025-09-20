import { create } from "zustand";
import type { Pupil,PupilInput } from "@/lib/pupilType";
import { getPupils, getPupilById, addPupil, updatePupil } from "@/lib/api";

type PupilState = {
    pupils: Pupil[];
    selectedPupil: Pupil | null;
    loading: boolean;
    error: string | null;

  // Actions
    fetchPupils: () => Promise<void>;
    fetchPupilById: (id: string) => Promise<void>;
    addPupil: ( data:PupilInput) => Promise<void>;
    updatePupil: (id: string, data:PupilInput) => Promise<void>;
};

export const usePupilStore = create<PupilState>((set) => ({
    pupils: [],
    selectedPupil: null,
    loading: false,
    error: null,

    fetchPupils: async () => {
        set({ loading: true, error: null });
        try {
        const data = await getPupils();
        set({ pupils: data, loading: false });
        } catch (err: any) {
        set({ error: err.message, loading: false });
        }
    },

    fetchPupilById: async (id: string) => {
        set({ loading: true, error: null });
        try {
        const data = await getPupilById(id);
        set({ selectedPupil: data, loading: false });
        } catch (err: any) {
        set({ error: err.message, loading: false });
        }
    },

    addPupil: async (data) => {
        set({ loading: true, error: null });
        try {
        const newPupil = await addPupil(data);
        set((state) => ({
            pupils: [...state.pupils, newPupil],
            loading: false,
        }));
        } catch (err: any) {
        set({ error: err.message, loading: false });
        }
    },

    updatePupil: async (id, data) => {
        set({ loading: true, error: null });
        try {
        const updated = await updatePupil(id, data);
        set((state) => ({
            pupils: state.pupils.map((p) => (p._id === id ? updated : p)),
            loading: false,
        }));
        } catch (err: any) {
        set({ error: err.message, loading: false });
        }
    },
}));
