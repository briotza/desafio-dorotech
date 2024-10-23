import { useState, useEffect } from "react"
import axios from "axios"


export default function ListaPersonagens() {
    const [personagens, setPersonagens] = useState([])

    const fetchPersonagens = async () => {
        try {
            const resposta = await axios.get('https://rickandmortyapi.com/api/character')
            setPersonagens(resposta.data.results)

        } catch (error) {
            console.log('Não foi possível carregar a lista:'), error
        }
    }

    return (
        <div>
            <h1 className="">Lista de Personagens</h1>
            <ul>
                {personagens.map(personagem => (
                    <li key={personagem.id}>
                        {personagem.id}
                        {personagem.name}
                    </li>
                ))}
            </ul>
        </div>
    )
}