import confeedlogo from "../assets/confeedlogo.svg";
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
const ComponentShowCase = () => {
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

            <InputFieldPassword></InputFieldPassword>
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
            <h3 className="text-xl font-semibold mb-4">SelectFieldMenu</h3>

            <RatingBasic rating={4.5} totalRatings={88} title="Bewertungen" />
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">SelectFieldMenu</h3>

            <RatingDetailed
              averageRating={4.2}
              totalRatings={58}
              ratingBreakdown={[40, 10, 5, 2, 1]}
            />
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">SelectFieldMenu</h3>

            <InputFieldTime label="Startzeit" stepMinutes={15} width="w-1/2" />
          </div>
        </div>
      </section>
    </div>
  );
};
export default ComponentShowCase;
