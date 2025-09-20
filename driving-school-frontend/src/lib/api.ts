import axios from 'axios';
import type { Pupil , PupilInput } from './pupilType';


const baseURL = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:6006/api';

console.log('API Base URL:', baseURL);

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

//<------------Pupils api calls-------------->


//get all pupil

export const getPupils = async (): Promise<Pupil[]> =>{
    const res = await api.get('/pupils');
    return res.data.data;
};

//get pupil by id

export const  getPupilById= async(pupilId: string): Promise<Pupil> => {
    const res = await api.get<{ success: boolean; data: Pupil }>(
    `/pupils/${pupilId}`
    );
    return res.data.data;
}

//add pupil

export const addPupil = async (pupil: PupilInput):Promise<Pupil> => {
    try {
        const res = await api.post<{success: boolean ; data:Pupil}>('/pupils', pupil);
        return res.data.data;    
    } 
    
    catch (err: any) {
        console.log("Full Backend error",err);
        console.error("Backend error details:", err.response?.data?.error.details);
        throw err;
    }
};

//update pupil

export const updatePupil = async (id: string, pupil:PupilInput)=>{
    const res = await api.put<{success:boolean, data:Pupil}>(`/pupils/${id}`,pupil);
    return res.data.data;
}

//delete pupil
export const deletePupil = async(id:string) => {
    const res = await api.delete(`/pupils/${id}`);
    return res.data.data;
};



export default api;