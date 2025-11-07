import ButtonRoundedFullBasePrimaryBasic from "../common/ButtonRoundedFullBasePrimaryBasic";
import FormElementsInputPlainBaseTrailingIcon from "../common/FormElementsInputPlainBaseTrailingIcon";
import FormElementsInputRoundedBaseBasic from "../common/FormElementsInputRoundedBaseBasic";
import confeedlogo from "../assets/confeedlogo.svg";

const AdminLogin = () => {
  return (
    <div>
      <img src={confeedlogo} alt="Confeed Logo" />
      <h1>Admin-login</h1>
      <FormElementsInputRoundedBaseBasic id="email" label="Email" />
      <FormElementsInputPlainBaseTrailingIcon />
      <ButtonRoundedFullBasePrimaryBasic>
        Einloggen
      </ButtonRoundedFullBasePrimaryBasic>
    </div>
  );
};

export default AdminLogin;