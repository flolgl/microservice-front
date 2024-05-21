import { useEffect, useState } from "react"
import { NavBar } from "../components/NavBar"
import { Logement } from "../Types/Logement"
import { Personne } from "../Types/Personne"
import { Visite } from "../Types/Visite";
import "./styles/Personnes.css";

export const Visites = () => {
    const [personnes, setPersonnes] = useState<Array<Personne>>([]);
    const [logements, setLogements] = useState<Array<Logement>>([]);
    const [visites, setVisites] = useState<Array<Visite>>([]);
    const [searchValue, setSearchValue] = useState<string>("");

    useEffect(() => {
        console.log("Je suis là");
        Promise.all([
            fetchAllPersonne(), 
            fetchAllLogements(),
            fetchAllVisites(),
        ])

    }, [])

    const fetchAllPersonne = async () => {
        fetch("http://localhost:8000/personne")
            .then(res => res.json())
            .then(res => setPersonnes(res))
            .catch(error => setPersonnes([]));
    }
    const fetchAllLogements = async () => {
        fetch("http://localhost:8000/logement")
            .then(res => res.json())
            .then(res => setLogements(res))
            .catch(error => setLogements([]));
    }
    const fetchAllVisites = async () => {
        fetch("http://localhost:8000/visiter")
            .then(res => res.json())
            .then(res => setVisites(res))
            .catch(error => setVisites([]));
    }

    const buildVisites = () => {
        return visites.map((visite, index) => {
            const client = personnes.find((personne) => personne.Id_Personne === visite.Id_Client); 
            const personnel = personnes.find((personne) => personne.Id_Personne === visite.Id_Personnel);
            const logement = logements.find(logement => logement.Id_Logement === visite.Id_Logement);
            const adresse = logement?.Adresse + " " + logement?.Ville ?? "Inconnu";
            const personnelNom = personnel?.Nom.toUpperCase() + " " + personnel?.Prenom ?? "Inconnu";
            const clientNom = client?.Nom.toUpperCase() + " " + client?.Prenom ?? "Inconnu";
            let inSearchValue = false;
            if (searchValue)
                [adresse, personnelNom, clientNom].forEach(v => {
                    if (v.toLocaleLowerCase().includes(searchValue))
                        inSearchValue = true;
                });

            if (searchValue && !inSearchValue)
                return; 

            return buildVisiteDiv(index, adresse, personnelNom, clientNom)
        });
    }

    const buildVisiteDiv = (index: number, adresse: string, personnel: string, client: string) => {
        return (
            <div key={index} style={{display: "flex", justifyContent:"space-evenly", gap: "3rem", padding:"1rem", borderBottom : index === visites.length ? "1px solid #FFF" : "0"}}>
                <div style={{width:"8rem"}}>
                    <span>{adresse}</span>
                </div>
                <div style={{width:"8rem"}}>
                    <span>{personnel}</span>
                </div>
                <div style={{width:"8rem"}}>
                    <span>{client}</span>
                </div>
            </div>
        )
    }

    const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value.toLowerCase());
    }

    return (
        <>
            <NavBar />
            <div style={{display: "flex", justifyContent: "center", margin: "1rem 15rem", gap: "1rem"}}>
                <input type="text" style={{padding:"0.5rem 0.5rem", width:"100%", border: "1px solid #FFF", borderRadius: "8px"}} onChange={handleSearchInput}/>
            </div>
            <div style={{display: "flex", justifyContent: "center", margin: "1rem 3rem"}}>
                <div style={{border: "1px solid #FFF", borderRadius:"8px"}}>
                    <div style={{display: "flex", justifyContent:"space-evenly", gap: "3rem", padding:"1rem", borderBottom : "1px solid #FFF"}}>
                        <div style={{width:"8rem"}}>
                            <span>Adresse</span>
                        </div>
                        <div style={{width:"8rem"}}>
                            <span>Encadré par</span>
                        </div>
                        <div style={{width:"8rem"}}>
                            <span>Visité par</span>
                        </div>
                    </div>
                    {logements ? buildVisites() : null}
                </div>
            </div>
        </>

    )
}