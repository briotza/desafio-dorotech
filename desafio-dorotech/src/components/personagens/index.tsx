import { useState, useEffect } from "react"
import axios from "axios"
import { Personagem } from "../../types/personagens.types"
import { Link } from "react-router-dom"

const opcoesGenero = ['Male', 'Female', 'Genderless', 'Unknown']
const opcoesStatus = ['Alive', 'Dead', 'Unknown']
const opcoesEspecie = ['Human', 'Alien', 'Robot', 'Unknown', 'Other']

export default function ListaPersonagens() {
    //Armazenar lista de personagens, quantidade de itens, total de personagens e páginas
    const [personagens, setPersonagens] = useState<Personagem[]>([])
    const [itens, setItens] = useState<number>(20)
    const [totalPersonagens, setTotalPersonagens] = useState<number>(0)
    const [pagina, setPagina] = useState<number>(1)

    //Armazenar filtros
    const [filtroGenero, setFiltroGenero] = useState<string>('')
    const [filtroStatus, setFiltroStatus] = useState<string>('')
    const [filtroEspecie, setFiltroEspecie] = useState<string>('')


    
    const fetchPersonagens = async () => {
        try {
            const todos = []
            let pagina = 1
            let continuar = true
            while (continuar) {
                //Requisição GET para a API
                const resposta = await axios.get(`https://rickandmortyapi.com/api/character?page=${pagina}`)
                //Armazena resposta da API
                todos.push(...resposta.data.results);
                //Condição para carregar todos os personagens
                if (resposta.data.info.next) {
                    pagina++
                } else {
                    continuar = false
                }
            }
            setPersonagens(todos)
            setTotalPersonagens(todos.length)

        } catch (error) {
            console.log('Não foi possível carregar a lista:'), error
        }
    }

    //Chamada da função fetch
    useEffect(() => {
        fetchPersonagens()
    }, [])

    //Mudança de itens por página
    const handleItensPagina = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setItens(Number(event.target.value))
        setPagina(1)
    }

    const filtrarPersonagens = () => {
        return personagens.filter(personagem => {
            const generoMatch = filtroGenero ? personagem.gender === filtroGenero : true;
            const statusMatch = filtroStatus ? personagem.status === filtroStatus : true;
            const especieMatch = filtroEspecie ? personagem.species === filtroEspecie : true;
            return generoMatch && statusMatch && especieMatch;
        });
    }

    const personagensFiltrados = filtrarPersonagens();


    //Lógica para exibição de personagens
    const inicio = (pagina-1) * itens
    const fim = inicio + itens
    const exibidos = personagensFiltrados.slice(inicio,fim)

    //Botões de navegação de página
    const proximo = () => {
        if(pagina < Math.ceil(personagensFiltrados.length/itens)){
            setPagina(pagina+1)
        }
    }
    const anterior = () => {
        if(pagina > 1){
            setPagina(pagina-1)
        }
    }

    

    return (
        <div>
            <h1 className="">Lista de Personagens</h1>

            <label>Filtro de Gênero:</label>
                <select onChange={(e) => setFiltroGenero(e.target.value)} value={filtroGenero}>
                    <option value="">Todos</option>
                    {opcoesGenero.map(genero => (
                        <option key={genero} value={genero}>{genero}</option>
                    ))}
                </select>
                <label>Filtro de Status:</label>
                <select onChange={(e) => setFiltroStatus(e.target.value)} value={filtroStatus}>
                    <option value="">Todos</option>
                    {opcoesStatus.map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>

                <label>Filtro de Espécie:</label>
                <select onChange={(e) => setFiltroEspecie(e.target.value)} value={filtroEspecie}>
                    <option value="">Todos</option>
                    {opcoesEspecie.map(especie => (
                        <option key={especie} value={especie}>{especie}</option>
                    ))}
                </select>
            {/* Lista de quantidade de itens */}
            <select onChange={handleItensPagina} value={itens}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
            </select>
            <ul>
                {/* Listagem de personagens */}
                {exibidos.map(personagem => (
                    <li key={personagem.id}>
                        <Link to={`/personagem/${personagem.id}`}>
                            {personagem.id} - 
                            {personagem.name} - 
                            {personagem.status}
                            <img src={personagem.image} className="w-20" />
                        </Link>
                    </li>
                ))}
            </ul>
            {/* Navegação entre páginas */}
            <button onClick={anterior}>
                Anterior
            </button>
            <button onClick={proximo}>
                Próximo
            </button>
        </div>
    )
}