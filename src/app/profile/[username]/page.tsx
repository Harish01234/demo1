'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import router from 'next/router';
import {useRouter} from "next/navigation";
import { User } from '@/model/model';
import { error } from 'console';
import { Input } from '@/components/ui/input';
export default function Page({ params }: { params: { username: string } }) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<string | null>(null);
 const [final, setfinal] = useState<string | null>(null)
 const [clickedset, setclickedset] = useState(false)
  const handlesignout=()=>{
    
    try {
      axios.get('/api/signout')
      router.push("/signin")
    } catch (error) {
      console.log("problem in signout");
    }
  }

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
  
    setActiveAction(null); // Reset action state when changing category
  };

  const handleActionClick = (action: string) => {
    if (activeCategory) {
      router.push(`/profile/${params.username}/${activeCategory}/${action}`);
    }
    setActiveAction(action)
    
   
  };

  const handleBackClick = () => {
    setActiveCategory(null);
    setActiveAction(null);
  };

  const handlefinalmoney = () => {
    axios.patch('/api/updateFinalMoney', { username: params.username })
      .then(response => {
        console.log('Money updated successfully:',response.data);
        getfinalmoney()
        // You can add more actions here, like updating the state or showing a notification
      })
      .catch(error => {
        console.error('Error updating money:', error);
        // You can add error handling here, like showing an error message to the user
      });
  };
  const setfinalmoney=async()=>{
    setclickedset(true);
    console.log(final);
    
    await axios.post('/api/setFinalMoney',{"username":params.username,
      "finalMoney":final
    }).then(response=>{
      if(response.status===200){
       
      }
      
    }).catch((error)=>{console.log(error);
    })
    

  }

  const getfinalmoney=()=>{
    axios.post('/api/getFinalMoney',{"username":params.username}).then(response=>{
      setfinal(response.data.final)

    }).catch(
      (error)=>{console.log(error);
      }
      
    )
  }

  const reset=()=>{
    axios.patch('/api/resetUserData',{"username":params.username}).then(response=>{
      console.log(response.data);
      
    }).catch((error)=>{
      console.log(error);
      
    })
  }

  return (
    <div>
      <h1>My Page with slug: {params.username}</h1>
      <div className='grid gap-4 m-9 sm:grid-cols-3 grid-cols-1'>
        {activeCategory === null ? (
          <>
            <Button onClick={() => handleCategoryClick('givenmoney')
              
            }>Given Money</Button>
            <Button onClick={() => handleCategoryClick('takenmoney')}>Taken Money</Button>
            <Button onClick={() => handleCategoryClick('extramoney')}>Extra Money</Button>
          </>
        ) : activeAction === null ? (
          <>
            <Button onClick={() => handleActionClick('add')}>Add</Button>
            <Button onClick={() => handleActionClick('delete')}>Delete</Button>
            <Button onClick={() => handleActionClick('update')}>Update</Button>
            <Button onClick={handleBackClick}>Back</Button>
          </>
        ) : (
          <>
            <Button onClick={() => handleActionClick('add')
            
            }>Add</Button>
            <Button onClick={() => handleActionClick('delete')}>Delete</Button>
            <Button onClick={() => handleActionClick('update')}>Update</Button>
            <Button onClick={handleBackClick}>Back</Button>
          </>
        )}
      </div>
      <label>final money:{final}</label>
      <div className='grid gap-4 m-9 sm:grid-cols-3 grid-col-1'>
       
        <Button onClick={handlefinalmoney}>update tabil</Button>
        <Button onClick={setfinalmoney}>set tabil</Button>
        <Button onClick={reset}>reset</Button>
        {
          clickedset &&(
            <div>
              <Input type='number' placeholder='finalMoney' name='finalMoney'  onChange={(e)=>setfinal(e.target.value)}/>
            </div>
          )
        }
      </div>
      
      <Button onClick={handlesignout}>signout</Button>
    </div>
  );
}
