import { useEffect, useState } from "react"
import { NavBar } from "../components/NavBar"
import { Logement } from "../Types/Logement"
import { Personne } from "../Types/Personne"
import "./styles/Personnes.css";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

export const Logements = () => {
    const [logements, setLogements] = useState<Array<JSX.Element>>([]);
    const [typesToDisplay, setTypesToDisplay] = useState<Array<string>>([]);
    const [locationSearchValue, setLocationSearchValue] = useState<string>("");
    const [typeSearchValue, setTypeSearchValue] = useState<string>("");
    const [budgetSearchValue, setBudgetSearchValue] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [debutDate, setDebutDate] = useState<string>("");
    const [open, setOpen] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const fetchAllMaisonTypes = () => {
         return fetch("http://localhost:8081/House/Types")
            .then(res => res.json())
            .then((types: Array<string>) => {
                setTypesToDisplay(types);
            });
    }

    useEffect(() => {
        Promise.all([
            buildLogements(),
            fetchAllMaisonTypes()
        ]);
        const dialog = document.querySelector('dialog');
        if (!dialog)
            return;
        const user = localStorage.getItem("user");
        if (user === null) {
            dialog.showModal();
            return;
        }
        dialog.close();
    }, [locationSearchValue, typeSearchValue, budgetSearchValue, open, endDate, debutDate]);

    const fetchAllLogements: (location?: string, type?: string, budget?: string) => Promise<Array<Logement>> = async (location?: string, type?: string, budget?: string) => {
        let url = "http://localhost:8081/House/search";
        if (location || type || budget) {
            const params = new URLSearchParams();
            if (location)
                params.append("location", location);
            if (type)
                params.append("type", type);
            if (budget)
                params.append("budget", budget);
            url += "?" + params.toString();
        }
        const res = await fetch(url);
        return await res.json();
    }

    const buildLogements = async () => {
        const logementsRes = await fetchAllLogements(locationSearchValue, typeSearchValue, budgetSearchValue);
        const mappedLogements = await Promise.all(logementsRes.map(async (logement) => {
            const proprioRes: Response = await fetch(`http://localhost:8082/User/${logement.ownerId}`);
            const proprio: Personne = await proprioRes.json();

            const adresse = (logement.location);
            const prix = logement.budget + "€";
            const personneNom = (proprio?.username?.toUpperCase()) ?? "Inconnu";

            return buildLogementDiv(adresse, logement.id, prix, personneNom, logement.type)
        }));
        setLogements(mappedLogements);
    }

    const handleChangeDebutDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDebutDate(e.target.value.toLowerCase());
    }

    const handleChangeEndDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(new Date(e.target.value))
        setEndDate(e.target.value.toLowerCase());
    }

    const buildLogementDiv = (adresse: string, index: number, prix: string, personneNom: string, typelogement: string) => {
        return (
            <div key={index} style={{display: "flex", justifyContent:"space-evenly", gap: "3rem", padding:"1rem"}}>
                <div style={{width:"8rem"}}>
                    <span>{adresse}</span>
                </div>
                <div style={{width:"5rem"}}>
                    <span>{prix}</span>
                </div>
                <div style={{width:"8rem"}}>
                    <span>{personneNom}</span>
                </div>
                <div style={{width:"8rem"}}>
                    <input type="date" style={{padding:"0.5rem 0.5rem", border: "1px solid #FFF", borderRadius: "8px"}} onChange={(e) => handleChangeDebutDate(e)} />
                </div>
                <div style={{width:"8rem"}}>
                    <input type="date" style={{padding:"0.5rem 0.5rem", border: "1px solid #FFF", borderRadius: "8px"}} onChange={(e) => handleChangeEndDate(e)}/>
                </div>
                <div style={{width:"8rem"}}>
                    <span>{typelogement}</span>
                </div>
                <div style={{width:"8rem"}}>
                    <button onClick={() => {handleLouer(index)}} className={"button-job"}>Rent out</button>
                </div>
            </div>
        )
    }


    const handleChangeLocationInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocationSearchValue(e.target.value.toLowerCase());
    }


    const handleBudgetInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBudgetSearchValue(e.target.value);
    }
    const handleHouseTypeInput = (e: string) => {
        setTypeSearchValue(e);
    }

    const handleLouer = async (index: number) => {
        console.log(endDate, debutDate)
        const userInStorage = localStorage.getItem("user");
        if (userInStorage === null) {
            alert("Vous devez vous connecter pour louer un logement");
            return;
        }
        const user = JSON.parse(userInStorage);

        const res = await fetch(`http://localhost:8083/Booking`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: -1,
                tenantId: user.id, // TODO: get tenant id
                houseId: index,
                "startDate": debutDate,
                "endDate": endDate,
                "isConfirmed": true,
                "isCancelled": false
            })
        });
        if (res.status === 200) {
            alert("Logement loué avec succès");
            buildLogements();
            return;
        }
        const reason = await res.text();
        alert("Erreur lors de la location : " + reason);
    }

    const handleDialogUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handleDialogPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleDialogClose = async () => {
        setOpen(false);
        if (username === "")
            return;
        const res = await fetch(`http://localhost:8084/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + btoa(username + ":" + password)
            }
        });
        if (res.status !== 200) {
            console.log("retrying...");
            setOpen(true); // retry
            return;
        }
        const user: Personne = await res.json();
        localStorage.setItem("user", JSON.stringify({id: user}));
        return;
    };

    const buildTypesSelect = () => {
        return typesToDisplay.map((type, index) => (
            <option key={index} value={type}>{type}</option>)
        );
    }

    const clearFilter = () => {
        setTypeSearchValue("");
        setBudgetSearchValue("");
        setLocationSearchValue("");
    }

    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    return (
        <>
            <dialog style={{padding:"1.5rem", border: "1px solid #FFF", borderRadius: "8px"}}>
                <form method="dialog" onSubmit={handleDialogClose} style={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: "1rem"}}>
                    <label>Who am I?</label>
                    <input type="text" value={username} placeholder="Username" onChange={handleDialogUsernameChange} style={{padding:"0.5rem 0.5rem", border: "1px solid #FFF", borderRadius: "8px"}}/>
                    <input type="password" value={password} placeholder="Password" onChange={handleDialogPasswordChange} style={{padding:"0.5rem 0.5rem", border: "1px solid #FFF", borderRadius: "8px"}}/>
                    <button type="submit" style={{padding:"0.5rem 0.5rem", border: "1px solid #FFF", borderRadius: "8px"}}>Confirm</button>
                </form>
            </dialog>
            <NavBar />
            <div style={{display: "flex", justifyContent: "center", margin: "1rem 3rem", gap: "1rem"}}>
                <input type="number" placeholder="Maximum budget" style={{padding:"0.5rem 0.5rem", border: "1px solid #FFF", borderRadius: "8px"}} onChange={handleBudgetInput}/>
                <input type="text" placeholder="Location" style={{padding:"0.5rem 0.5rem", border: "1px solid #FFF", borderRadius: "8px"}} onChange={handleChangeLocationInput}/>
                <select style={{padding:"0.5rem 0.5rem", border: "1px solid #FFF", borderRadius: "8px"}} onChange={(e) => handleHouseTypeInput(e.target.value)}>
                    <option value="">---</option>
                    {typesToDisplay.length > 0 ? buildTypesSelect() : <></>}
                </select>
                <button onClick={clearFilter} className={"button-job"}>Clear filters</button>
            </div>
            <div style={{display: "flex", justifyContent: "center", margin: "1rem 3rem"}}>
                <div style={{border: "1px solid #FFF", borderRadius:"8px"}}>
                    <div style={{display: "flex", justifyContent:"space-evenly", gap: "3rem", padding:"1rem", borderBottom : "1px solid #FFF"}}>
                        <div style={{width:"8rem"}}>
                            <span>City</span>
                        </div>
                        <div style={{width:"5rem"}}>
                            <span>Price</span>
                        </div>
                        <div style={{width:"8rem"}}>
                            <span>Owner</span>
                        </div>
                        <div style={{width:"8rem"}}>
                            <span>Rent from</span>
                        </div>
                        <div style={{width:"8rem"}}>
                            <span>until</span>
                        </div>
                        <div style={{width:"8rem"}}>
                            <span>Type</span>
                        </div>
                        <div style={{width:"8rem"}}>
                            <span>Action</span>
                        </div>
                    </div>
                    {logements ? logements : <div/>}
                </div>
            </div>
        </>

    )
}