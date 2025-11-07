import InputFieldPassword from "../common/InputFieldPassword";
import InputFieldBasic from "../common/InputFieldBasic";
import confeedlogo from "../assets/confeedlogo.svg";
import ErrorPopup from "../common/ErrorPopup";
import ButtonLoadingAnimated from "../common/ButtonLoadingAnimated";

const AdminLogin = () => {
  return (
    <div>
      <img src={confeedlogo} alt="Confeed Logo" className="w-[85vw] h-auto mx-auto" />
      <h2>Admin-login</h2>
      <InputFieldBasic id={"email"} label={"Email"} />
      <InputFieldPassword />
      <ButtonLoadingAnimated 
      text={"Einloggen"} 
      loadingText={"Wird geladen..."} 
      onClick={async () => {
      // z. B. API-Aufruf simulieren
      await new Promise((r) => setTimeout(r, 2000));
      alert("Fertig!");
      }} />
      <ErrorPopup title={"Fehler beim Einloggen"} message={"Falsches Passwort."} visible={true} position="bottom" />
    </div>
  );
};

export default AdminLogin;