import { useEffect, useState } from "react"
import { NavBar } from "../components/NavBar"
import { Etat } from "../Types/Etat";
import { Garage } from "../Types/Garage";
import { Logement } from "../Types/Logement"
import { Loue } from "../Types/Loue";
import { Personne } from "../Types/Personne"
import { PersonneHeritage } from "../Types/PersonneHeritage";
import { Vendu } from "../Types/Vendu";
import "./styles/Personnes.css";

export const Logements = () => {
    const [personnes, setPersonnes] = useState<Array<Personne>>([]);
    const [logements, setLogements] = useState<Array<Logement>>([]);
    const [etats, setEtats] = useState<Array<Etat>>([]);
    const [garages, setGarages] = useState<Array<Garage>>([]);
    const [vendus, setVendus] = useState<Array<Vendu>>([]);
    const [loues, setLoues] = useState<Array<Loue>>([]);
    const [typesToDisplay, setTypesToDisplay] = useState<Array<string>>(["Vendu", "Loué", "Listé"]);
    const [searchValue, setSearchValue] = useState<string>("");

    useEffect(() => {
        console.log("Je suis là");
        Promise.all([
            fetchAllPersonne(), 
            fetchAllLogements(),
            fetchAllEtats(),
            fetchAllGarages(),
            fetchAllVendus(),
            fetchAllLocations()
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
    const fetchAllEtats = async () => {
        fetch("http://localhost:8000/etat")
            .then(res => res.json())
            .then(res => setEtats(res))
            .catch(error => setEtats([]));
    }
    const fetchAllGarages = async () => {
        fetch("http://localhost:8000/garage")
            .then(res => res.json())
            .then(res => setGarages(res))
            .catch(error => setGarages([]));
    }
    const fetchAllVendus = async () => {
        fetch("http://localhost:8000/acheter")
            .then(res => res.json())
            .then(res => setVendus(res))
            .catch(error => setVendus([]));
    }
    const fetchAllLocations = async () => {
        fetch("http://localhost:8000/louer")
            .then(res => res.json())
            .then(res => setLoues(res))
            .catch(error => setLoues([]));
    }

    const buildLogements = () => {
        return logements.map((logement, index) => {
            const isSold = vendus.find(vendu => vendu.Id_Logement === logement.Id_Logement)
            const isLoue = loues.find(loue => loue.Id_Logement === logement.Id_Logement)
            let state = "Listé";
            if (isSold)
                state = "Vendu"
            if (isLoue)
                state = "Loué"
            if (!typesToDisplay.includes(state))
                return;
            const proprio = personnes.find((personne) => personne.Id_Personne === logement.Id_Personne); 

            const adresse = (logement.Adresse + " " + logement.Ville);
            const nbPieces = `${logement.Nb_pieces}`;
            const objGestion = logement.Objet_gestion === "V" ? "Vente" : "Location";
            const prix = logement.Prix + "€";
            const dateDispo = new Date(logement.Date_Dispo).toLocaleDateString(undefined, {year: "numeric", month:"numeric", day:"numeric"});
            const etat = etats.at(logement.Id_Etat-1)?.Libellé ?? "Inconnu";
            const garageNb = garages.filter((garage => garage.Id_Logement === logement.Id_Logement)).length + "";
            const personneNom = (proprio?.Nom.toUpperCase() + " " + proprio?.Prenom) ?? "Inconnu";        
            let isInSearch = false;    

            if (searchValue){       
                [adresse, garageNb, state, nbPieces, objGestion, prix, dateDispo, etat, personneNom]
                    .forEach((value) => {
                        if (value.toLowerCase().includes(searchValue))
                            isInSearch = true;
                    })
                if (!isInSearch)
                    return
            }
            return buildLogementDiv(adresse, garageNb, index, state, nbPieces, objGestion, prix, dateDispo, etat, personneNom)
        });
    }

    const buildLogementDiv = (adresse: string, garage: string, index: number, state: string, nbPieces: string, objGestion: string, prix: string, dateDispo: string, etat: string, personneNom: string) => {
        return (
            <div key={index} style={{display: "flex", justifyContent:"space-evenly", gap: "3rem", padding:"1rem", borderBottom : index === logements.length ? "1px solid #FFF" : "0"}}>
                <div style={{width:"8rem"}}>
                    <span>{adresse}</span>
                </div>
                <div style={{width:"2rem"}}>
                    <span>{nbPieces}</span>
                </div>
                <div style={{width:"3rem"}}>
                    <span>{objGestion}</span>
                </div>
                <div style={{width:"5rem"}}>
                    <span>{prix}</span>
                </div>
                <div style={{width:"4rem"}}>
                    <span>{dateDispo}</span>
                </div>
                <div style={{width:"4rem"}}>
                    <span>{etat}</span>
                </div>
                <div style={{width:"2rem"}}>
                    <span>{garage}</span>
                </div>
                <div style={{width:"8rem"}}>
                    <span>{personneNom}</span>
                </div>
                <div style={{width:"4rem"}}>
                    <span>{state}</span>
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
            <div style={{display: "flex", justifyContent: "center", margin: "1rem 3rem", gap: "1rem"}}>
                <button onClick={() => {setTypesToDisplay(["Vendu"])}} className={"button-job"}>Ventes</button>
                <button onClick={() => {setTypesToDisplay(["Loué"])}} className={"button-job"}>Locations</button>
                <button onClick={() => {setTypesToDisplay(["Listé"])}} className={"button-job"}>Listés</button>
                <button onClick={() => {setTypesToDisplay(["Loué", "Vendu", "Listé"])}} className={"button-job"}>Tous</button>
            </div>
            <div style={{display: "flex", justifyContent: "center", margin: "1rem 15rem", gap: "1rem"}}>
                <input type="text" style={{padding:"0.5rem 0.5rem", width:"100%", border: "1px solid #FFF", borderRadius: "8px"}} onChange={handleSearchInput}/>
            </div>
            <div style={{display: "flex", justifyContent: "center", margin: "1rem 3rem"}}>
                <div style={{border: "1px solid #FFF", borderRadius:"8px"}}>
                    <div style={{display: "flex", justifyContent:"space-evenly", gap: "3rem", padding:"1rem", borderBottom : "1px solid #FFF"}}>
                        <div style={{width:"8rem"}}>
                            <span>Adresse</span>
                        </div>
                        <div style={{width:"2rem"}}>
                            <span>Nombre de pièces</span>
                        </div>
                        <div style={{width:"3rem"}}>
                            <span>Objet de gestion</span>
                        </div>
                        <div style={{width:"5rem"}}>
                            <span>Prix</span>
                        </div>
                        <div style={{width:"4rem"}}>
                            <span>Date disponibilité</span>
                        </div>
                        <div style={{width:"4rem"}}>
                            <span>Etat</span>
                        </div>
                        <div style={{width:"2rem"}}>
                            <span>Nb garage</span>
                        </div>
                        <div style={{width:"8rem"}}>
                            <span>Propriétaire</span>
                        </div>
                        <div style={{width:"4rem"}}>
                            <span>Etat de la vente</span>
                        </div>
                    </div>
                    {logements ? buildLogements() : null}
                </div>
            </div>
        </>

    )
}