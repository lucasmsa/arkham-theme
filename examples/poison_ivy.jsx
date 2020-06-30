import React, {useState} from 'react'

const Poison_Ivy = () => {
    const [poison, setPoison] = useState('Neutral')

    const applyPoison = () => {
        setPoison('Poisoned')
    }

    return (
        <div>
            <Thrust onClick={applyPoison}/> 
        </div>
    )       
}