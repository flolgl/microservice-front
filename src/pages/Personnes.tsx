import { useEffect, useState } from "react"
import { NavBar } from "../components/NavBar"
import { Personne } from "../Types/Personne"
import { PersonneHeritage } from "../Types/PersonneHeritage";
import "./styles/Personnes.css";

export const Personnes = () => {
    const [personnes, setPersonnes] = useState<Array<Personne>>([]);
    const [clients, setClients] = useState<Array<PersonneHeritage>>([]);
    const [personnels, setPersonnels] = useState<Array<PersonneHeritage>>([]);
    const [jobsToDisplay, setjobsToDisplay] = useState<Array<string>>(["Client", "Personnel", "Propriétaire"]);
    const [searchValue, setSearchValue] = useState<string>("");
    useEffect(() => {
        console.log("Je suis là");
        Promise.all([
            fetchAllPersonne(), 
            fetchAllClients(),
            fetchAllPersonnels()
        ])

    }, [])

    const fetchAllPersonne = async () => {
        fetch("http://localhost:8000/personne")
            .then(res => res.json())
            .then(res => setPersonnes(res))
            .catch(error => setPersonnes([]));
    }
    const fetchAllClients = async () => {
        fetch("http://localhost:8000/client")
            .then(res => res.json())
            .then(res => setClients(res))
            .catch(error => setClients([]));
    }
    const fetchAllPersonnels = async () => {
        fetch("http://localhost:8000/personnel")
            .then(res => res.json())
            .then(res => setPersonnels(res))
            .catch(error => setPersonnels([]));
    }

    const getJob = (id: number): string => {
        if (clients.find((v) => v.Id === id))
            return "Client";
        if (personnels.find((v) => v.Id === id))
            return "Personnel";
        return "Propriétaire";
    }

    const buildPersonnes = () => {
        const values = searchValue ? findPersonnes(searchValue.toLocaleLowerCase()) : personnes;
        const div = values.map((personne, index)=> {
            const job = getJob(personne.Id_Personne);
            if (!jobsToDisplay.includes(job))
                return;
            return buildPersonDiv(personne, job, index);
        });
        return div;
    }

    const findPersonnes = (searchV: string): Array<Personne> => {
        return personnes.filter((value) => {
            let isGood = false;
            const job = getJob(value.Id_Personne);
            if (job.toLocaleLowerCase().includes(searchV))
                isGood = true;
            Object.entries(value).forEach(([key, v]) => {
                const b = `${v}`;
                if (b.toLocaleLowerCase().includes(searchV))
                    isGood = true;
            });
            return isGood;
        })
    }

    const buildPersonDiv = (personne: Personne, job: string, index: number) => {
        return (
            <div key={personne.Id_Personne} style={{display: "flex", justifyContent:"space-evenly", gap: "3rem", padding:"1rem", borderBottom : index === personnes.length ? "1px solid #FFF" : "0"}}>
                <div style={{width:"8rem"}}>
                    <span>{personne.Nom.toUpperCase() + " " + personne.Prenom}</span>
                </div>
                <div style={{width:"8rem"}}>
                    <span>{personne.Adresse}</span>
                </div>
                <div style={{width:"8rem"}}>
                    <span>{job}</span>
                </div>
            </div>
        )
    }

    const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    }

    return (
        <>
            <NavBar />
            <div style={{display: "flex", justifyContent: "center", margin: "1rem 3rem", gap: "1rem"}}>
                <button onClick={() => {setjobsToDisplay(["Propriétaire"])}} className={"button-job"}>Propriétaires</button>
                <button onClick={() => {setjobsToDisplay(["Personnel"])}} className={"button-job"}>Personnels</button>
                <button onClick={() => {setjobsToDisplay(["Client"])}} className={"button-job"}>Clients</button>
                <button onClick={() => {setjobsToDisplay(["Client", "Propriétaire", "Personnel"])}} className={"button-job"}>Tous</button>
            </div>
            <div style={{display: "flex", justifyContent: "center", margin: "1rem 15rem", gap: "1rem"}}>
                <input type="text" style={{padding:"0.5rem 0.5rem", width:"100%", border: "1px solid #FFF", borderRadius: "8px"}} onChange={handleSearchInput}/>
            </div>
            <div style={{display: "flex", justifyContent: "center", margin: "1rem 3rem"}}>
                <div style={{border: "1px solid #FFF", borderRadius:"8px"}}>
                    <div style={{display: "flex", justifyContent:"space-evenly", gap: "3rem", padding:"1rem", borderBottom : "1px solid #FFF"}}>
                        <div style={{width:"8rem"}}>
                            <span>NOM Prénom</span>
                        </div>
                        <div style={{width:"8rem"}}>
                            <span>Adresse</span>
                        </div>
                        <div style={{width:"8rem"}}>
                            <span>Rôle</span>
                        </div>
                    </div>
                    {personnes ? buildPersonnes() : null}
                </div>
            </div>
        </>

    )
}