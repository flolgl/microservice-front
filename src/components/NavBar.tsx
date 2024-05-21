import { NavLink } from "react-router-dom"

export const NavBar = () => (
    <div style={{...ContainerCenter, ...NavBarStyle}}>
        <div style={Container}>
            <NavLink to={"/logements"} style={styleLinks}>Logements</NavLink>
            <NavLink to={"/personnes"} style={styleLinks}>Personnes</NavLink>
            <NavLink to={"/visites"} style={styleLinks}>Visites</NavLink>
            <NavLink to={"/transactions"} style={styleLinks}>Transactions</NavLink>
        </div>
    </div>
)

const ContainerCenter = {display: "flex", justifyContent:"center", padding:"1rem"}
const NavBarStyle =  {backgroundColor : "#555555"}
const styleLinks = {color: "#FFFFFF"}
const Container = {display: "flex", justifyContent:"space-between", gap:"3rem"}