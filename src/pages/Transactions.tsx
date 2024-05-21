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

export const Transactions = () => {
    const [personnes, setPersonnes] = useState<Array<Personne>>([]);
    const [logements, setLogements] = useState<Array<Logement>>([]);
    const [etats, setEtats] = useState<Array<Etat>>([]);
    const [garages, setGarages] = useState<Array<Garage>>([]);
    const [vendus, setVendus] = useState<Array<Vendu>>([]);
    const [loues, setLoues] = useState<Array<Loue>>([]);
    const [typesToDisplay, setTypesToDisplay] = useState<Array<string>>(["Vendu", "Loué"]);
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
        console.log(loues)
        return logements.map((logement, index) => {
            const vendu = vendus.find(vendu => vendu.Id_Logement === logement.Id_Logement)
            const loue = loues.find(loue => loue.Id_Logement === logement.Id_Logement)
            let state = "";
            let dateAchat = "", dateFin = "", prix = "", client;
            if (vendu){
                state = "Vendu"
                dateAchat = new Date(vendu?.DateAchat ?? "").toLocaleDateString(undefined, {year: "numeric", month:"numeric", day:"numeric"}) ?? "Inconnu";
                prix = vendu?.Prix ?? "Inconnu"
                client = personnes.find(personne => vendu.Id_Client === personne.Id_Personne);
            }
            if (loue){
                state = "Loué";
                dateAchat = new Date(loue?.Date_Debut ?? "").toLocaleDateString(undefined, {year: "numeric", month:"numeric", day:"numeric"}) ?? "Inconnu";
                dateFin = new Date(loue?.Date_Fin ?? "").toLocaleDateString(undefined, {year: "numeric", month:"numeric", day:"numeric"}) ?? "Inconnu";
                prix = loue.Prix ?? "Inconnu";
                client = personnes.find(personne => loue.Id_Client === personne.Id_Personne);
            }
            if (!loue && !vendu)
                return;
            if (!typesToDisplay.includes(state))
                return;
            const garageNb = garages.filter((garage => garage.Id_Logement === logement.Id_Logement)).length + "";
            const proprio = personnes.find((personne) => personne.Id_Personne === logement.Id_Personne);
            const adresse = logement.Adresse + " " + logement.Ville,
                nbPieces = logement.Nb_pieces + "",
                etat = etats.at(logement.Id_Etat-1)?.Libellé ?? "Inconnu",
                exProprio = (proprio?.Nom.toUpperCase() + " " + proprio?.Prenom) ?? "Inconnu",
                clientNom = (client?.Nom.toUpperCase() + " " + client?.Prenom) ?? "Inconnu";
            if (searchValue){
                let isFound = false;
                [adresse, garageNb, state, prix, nbPieces, etat, exProprio, clientNom, dateFin, dateAchat]
                    .forEach(value => {
                        if(value.toLocaleLowerCase().includes(searchValue))
                            isFound = true;
                    });
                if (!isFound)
                    return;
            }
                                

            return buildLogementDiv(adresse, garageNb, index, state, prix, nbPieces, etat, exProprio, clientNom, dateFin, dateAchat)
        });
    }

    const buildLogementDiv = (adresse: string, garage: string, index: number, state: string,  prix: string, nbPieces: string, etat: string, exProprio: string, client: string, dateFin: string, dateDebut: string) => {
        console.log(dateDebut);
        return (
            <div key={index} style={{display: "flex", justifyContent:"space-evenly", gap: "3rem", padding:"1rem", borderBottom : index === logements.length ? "1px solid #FFF" : "0"}}>
                <div style={{width:"8rem"}}>
                    <span>{adresse}</span>
                </div>
                <div style={{width:"2rem"}}>
                    <span>{nbPieces}</span>
                </div>
                <div style={{width:"5rem"}}>
                    <span>{prix}</span>
                </div>
                <div style={{width:"4rem"}}>
                    <span>{dateDebut ?? ""}</span>
                </div>
                <div style={{width:"4rem"}}>
                    <span>{dateFin ?? ""}</span>
                </div>
                <div style={{width:"4rem"}}>
                    <span>{etat}</span>
                </div>
                <div style={{width:"2rem"}}>
                    <span>{garage}</span>
                </div>
                <div style={{width:"8rem"}}>
                    <span>{exProprio}</span>
                </div>
                <div style={{width:"8rem"}}>
                    <span>{client}</span>
                </div>
                <div style={{width:"4rem"}}>
                    <span>{state}</span>
                </div>
            </div>
        )
    }

    const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value.toLocaleLowerCase());
    }

    return (
        <>
            <NavBar />
            <div style={{display: "flex", justifyContent: "center", margin: "1rem 3rem", gap: "1rem"}}>
                <button onClick={() => {setTypesToDisplay(["Vendu"])}} className={"button-job"}>Ventes</button>
                <button onClick={() => {setTypesToDisplay(["Loué"])}} className={"button-job"}>Location</button>
                <button onClick={() => {setTypesToDisplay(["Loué", "Vendu"])}} className={"button-job"}>Tous</button>
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
                        <div style={{width:"5rem"}}>
                            <span>Prix</span>
                        </div>
                        <div style={{width:"4rem"}}>
                            <span>Date achat/début</span>
                        </div>
                        <div style={{width:"4rem"}}>
                            <span>Date de fin</span>
                        </div>
                        <div style={{width:"4rem"}}>
                            <span>Etat</span>
                        </div>
                        <div style={{width:"2rem"}}>
                            <span>Nb garage(s)</span>
                        </div>
                        <div style={{width:"8rem"}}>
                            <span>Ex-propriétaire</span>
                        </div>
                        <div style={{width:"8rem"}}>
                            <span>Nouveau propriétaire</span>
                        </div>
                        <div style={{width:"5rem"}}>
                            <span>Type transaction</span>
                        </div>
                    </div>
                    {logements ? buildLogements() : null}
                </div>
            </div>
        </>

    )
}