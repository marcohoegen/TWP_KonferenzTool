import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import confeedlogo from "../assets/confeedlogo.svg";
import BasicSpinner from "../common/BasicSpinner";
import ButtonGreenRed from "../common/ButtonGreenRed";
import ButtonImport from "../common/ButtonImport";
import ButtonLoadingAnimated from "../common/ButtonLoadingAnimated";
import ButtonRoundedLgPrimaryBasic from "../common/ButtonRoundedLgPrimaryBasic";
import ButtonStandard from "../common/ButtonStandard";
import CardBasic from "../common/CardBasic";
import ErrorPopup from "../common/ErrorPopup";
import InputDatePicker from "../common/InputDatePicker";
import InputFieldBasic from "../common/InputFieldBasic";
import InputFieldBasicRounded from "../common/InputFieldBasicRounded";
import InputFieldPassword from "../common/InputFieldPassword";
import InputTextarea from "../common/InputTextarea";
import RatingBasic from "../common/RatingBasic";
import RatingDetailed from "../common/RatingDetailed";
import SelectFieldMenu from "../common/SelectFieldMenu";
import InputFieldTime from "../components/InputFieldTime";
import AccordionBasic from "../common/AccordionBasic";
import TableResponsive from "../common/TableResponsive";
import ProgressBar from "../common/ProgressBar";
import ButtonBack from "../components/ButtonBack";
import ButtonTrashbin from "../components/ButtonTrashbin";
import ButtonLanguage from "../components/ButtonLanguage";
import ToggleStandard from "../components/ToggleStandard";
import ButtonOptions from "../components/ButtonOptions";
import InputRating from "../components/InputRating";
import CheckboxBasic from "../common/CheckBoxBasic";
import ButtonMenu from "../components/ButtonMenu";
const ComponentShowCase = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <img
        src={confeedlogo}
        alt="Confeed Logo"
        className="content-center"
        width={400}
      />

      <section className="p-8 bg-gray-50 min-h-screen">
        <h2 className="text-2xl font-semibold mb-6">Component-Showcase:</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">ButtonGreenRed</h3>
            <ButtonGreenRed></ButtonGreenRed>
          </div>
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">ButtonImport</h3>
            <ButtonImport></ButtonImport>
          </div>
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">
              ButtonLoadingAnimated
            </h3>
            <ButtonLoadingAnimated></ButtonLoadingAnimated>
          </div>
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">
              ButtonRoundedLgPrimaryBasic
            </h3>
            <ButtonRoundedLgPrimaryBasic>
              TestButton
            </ButtonRoundedLgPrimaryBasic>
          </div>
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">ButtonStandard</h3>

            <ButtonStandard children={"TestButton"}></ButtonStandard>
          </div>
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">CardBasic</h3>

            <CardBasic title={"TestCard"}></CardBasic>
          </div>
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">ErrorPopup</h3>

            <ErrorPopup title="Fehler" />
          </div>
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">InputDatePicker</h3>

            <InputDatePicker
              id={"TestDatePickerId"}
              label={"TestDateInput"}
            ></InputDatePicker>
          </div>
          
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">InputFieldTime</h3>

            <InputFieldTime label="Startzeit" stepMinutes={15} width="w-1/2" />
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">InputFieldBasic</h3>

            <InputFieldBasic
              id={"TestInputFieldId"}
              label={"TestInputField"}
            ></InputFieldBasic>
          </div>
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">
              InputFieldBasicRounded
            </h3>

            <InputFieldBasicRounded
              id={"TestInputBasicRoundedId"}
              label={"TestInputBasisRounded"}
            ></InputFieldBasicRounded>
          </div>
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">InputFieldPassword</h3>

            <InputFieldPassword id={""} label={""} value={""} onChange={function (e: ChangeEvent<HTMLInputElement>): void {
              throw new Error("Function not implemented.");
            } }></InputFieldPassword>
          </div>
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">InputTextarea</h3>

            <InputTextarea
              id={"InputTextAreaId"}
              label={"InputTextArea"}
            ></InputTextarea>
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">SelectFieldMenu</h3>

            <SelectFieldMenu
              id={"SelectFieldMenuId"}
              label={"TestSelectFieldMenu"}
              options={[
                { value: "option1", label: "Option 1" },
                { value: "option2", label: "Option 2" },
                { value: "option3", label: "Option 3" },
              ]}
            ></SelectFieldMenu>
          </div>
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">RatingBasic</h3>

            <RatingBasic rating={4.5} totalRatings={88} title="Bewertungen" />
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">RatingDetailed</h3>

            <RatingDetailed
              averageRating={4.2}
              totalRatings={58}
              ratingBreakdown={[40, 10, 5, 2, 1]}
            />
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">AccordionBasic</h3>

            <AccordionBasic
              items={[
                  { id: "ac01", title: "How does TailwindCSS work?", content: "Tailwind CSS works by scanning..." },
                  { id: "ac02", title: "How do I install TailwindCSS?", content: "The simplest and fastest way..." },
                  { id: "ac03", title: "What is Wind UI about?", content: "Expertly made components..." },
                  { id: "ac04", title: "How do I use Wind UI components?", content: "All components can be copied..." },
              ]}
          />         
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">TableResponsive</h3>

            <TableResponsive
              columns={[
                { key: "name", label: "Name" },
                { key: "age", label: "Age" },
                { key: "email", label: "Email" },
              ]}
              data={[
                { name: "John Doe", age: "30", email: "john@example.com" },
                { name: "Jane Smith", age: "25", email: "jane@example.com" },
                { name: "Bob Johnson", age: "40", email: "bob@example.com" },
              ]}
            />
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">ProgressBar</h3>

            <ProgressBar
            startTime="2025-11-13T21:20:00Z"
            endTime="2025-11-13T22:00:00Z"
            label="Konferenz läuft"
            direction="fill"
            />
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">ButtonBack</h3>

            <ButtonBack onClick={() => navigate("/adminseite")} size={50} />
          </div>
              
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">ButtonTrashbin</h3>

            <ButtonTrashbin onConfirm={() => alert("Gelöscht!")} size={50} />
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">ButtonLanguage</h3>

            <ButtonLanguage size={50} iconSize={50}/>
          </div>
              
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">ToggleStandard</h3>

            <ToggleStandard label="An/Aus" size={40} />
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">ButtonOptions</h3>

            <ButtonOptions size={40} />
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">InputRating</h3>

            <InputRating 
              onRatingChange={(rating) => console.log(`User rated: ${rating}`)}
              title="Wie hat dir die Konferenz gefallen?"
            />
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">CheckboxBasic</h3>

            <CheckboxBasic 
              label="Accept terms" 
              isPlaceholder 
            />
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">ButtonMenu</h3>

            <ButtonMenu 
              items={[
                { label: "Home", path: "/" },
                { label: "Profile", path: "/profile" },
                { label: "Settings", path: "/settings" },
              ]}
              size={40}
              onNavigate={(path) => console.log(`Navigate to: ${path}`)}
            />
          </div>
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Basic Spinner</h3>

            <BasicSpinner />
          </div>
        </div>
      </section>
    </div>
  );
};
export default ComponentShowCase;
