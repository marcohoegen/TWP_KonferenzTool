import InputFieldBasic from "../common/InputFieldBasic";
import SelectFieldMenu from "../common/SelectFieldMenu";
import InputTextarea from "../common/InputTextarea";
import InputDatePicker from "../common/InputDatePicker";
import InputFieldTime from "../components/InputFieldTime";
import ButtonRoundedLgPrimaryBasic from "../common/ButtonRoundedLgPrimaryBasic";

const NewConference = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-xl mx-auto px-4">
        <h2 className="text-2xl font-semibold text-slate-800 mb-6">
          Neue Konferenz
        </h2>

        <InputFieldBasic id="konferenzname" label="Name der Konferenz" />

        <div className="flex flex-row gap-4 w-full">
          <div className="flex-1">
            <InputFieldBasic id="straße" label="Straße" />
          </div>
          <div className="w-20">
            <InputFieldBasic id="hausnummer" label="Nr" />
          </div>
          <div className="w-28">
            <InputFieldBasic id="postleitzahl" label="PLZ" />
          </div>
        </div>

        <div className="flex flex-row gap-4 w-full">
          <div className="flex-1">
            <InputFieldBasic id="stadt" label="Stadt" />
          </div>
          <div className="w-40">
            <SelectFieldMenu
              id="land"
              label="Land auswählen"
              width="w-full"
              options={[
                { value: "de", label: "Deutschland" },
                { value: "at", label: "Österreich" },
                { value: "ch", label: "Schweiz" },
              ]}
            />
          </div>
        </div>

        <InputTextarea
          id="beschreibung"
          label="Beschreibung hinzufügen"
          helperText="."
          rows={4}
          resizable
        />

        <div className="flex flex-row gap-4 w-full">
          <div className="flex-1">
            <InputDatePicker id="startdatum" label="Startdatum" />
          </div>
          <div className="w-40">
            <InputFieldTime id="startzeit" label="Startzeit" />
          </div>
        </div>

        <div className="flex flex-row gap-4 w-full">
          <div className="flex-1">
            <InputDatePicker id="enddatum" label="Enddatum" />
          </div>
          <div className="w-40">
            <InputFieldTime id="endzeit" label="Endzeit" />
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <ButtonRoundedLgPrimaryBasic variant="primary" size="md">
            Abbrechen
          </ButtonRoundedLgPrimaryBasic>
          <ButtonRoundedLgPrimaryBasic variant="primary" size="md">
            Erstellen
          </ButtonRoundedLgPrimaryBasic>
        </div>
      </div>
    </div>
  );
};

export default NewConference;