import { useState, useEffect } from "react";
import axios from "axios";


const useCategory = ()=>{
    const [categories, setCategories] = useState([]);

    //Get All Categories
    const getAllCategories = async()=>{
        try {
            const {data} = await axios.get('http://localhost:8080/api/v1/category/get-category');
        if(data?.success){
            setCategories(data.category);
        }
            
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{ getAllCategories(); }, []);
    return categories;
}

export default useCategory;