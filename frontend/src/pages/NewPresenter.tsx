import SelectFieldMenu from "../common/SelectFieldMenu";
import InputFieldBasic from "../common/InputFieldBasic";
import InputDatePicker from "../common/InputDatePicker";
import InputFieldTime from "../components/InputFieldTime";
import ButtonRoundedLgPrimaryBasic from "../common/ButtonRoundedLgPrimaryBasic";

const NewPresenter = () => {
  return (
    <div className="min-h-screen py-8">
      
      
        <h2 className="text-2xl font-semibold text-slate-800 mb-6">
          Neuer Vortragender
        </h2>

        
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <SelectFieldMenu
              id="anrede"
              label="Anrede"
              width="w-full"
              options={[
                { value: "hr", label: "Herr" },
                { value: "fr", label: "Frau" },
                { value: "dv", label: "Divers" },
              ]}
            />
          </div>
          <div className="flex-1">
            <SelectFieldMenu
              id="akademischerTitel"
              label="Titel"
              width="w-full"
              options={[
                { value: "dr", label: "Dr." },
                { value: "di", label: "Dipl. Ing." },
                { value: "an", label: "Andere" },
              ]}
            />
          </div>
        </div>

       <div className="space-y-6">
        <div className="mb-0">
          <InputFieldBasic id="vorname" label="Vorname" />
        </div>
        <div className="mb-4">
          <InputFieldBasic id="nachname" label="Nachname" />
        </div>
        </div>

        
        <div className="mb-4">
          <div className="mb-2">
            <InputDatePicker id="startdatum" label="Datum" />
          </div>
          <div className="flex gap-2">
            <div className="w-28">
              <InputFieldTime id="startzeit" label="Uhrzeit" />
            </div>
            <div className="w-28">
              <InputFieldTime id="endzeit" label="Endzeit" />
            </div>
          </div>
        </div>

        
        <div className="mb-4">
          <InputFieldBasic
            id="namederpräsentation"
            label="Name der Präsentation"
          />
        </div>


        
        <div className="mb-6">
          <InputFieldBasic id="raum" label="Raum" />
        </div>

        
        <div className="flex justify-end gap-3">
          <ButtonRoundedLgPrimaryBasic variant="customer" size="md">
            Abbrechen
          </ButtonRoundedLgPrimaryBasic>
          <ButtonRoundedLgPrimaryBasic variant="primary" size="md">
            Erstellen
          </ButtonRoundedLgPrimaryBasic>
        </div>
      </div>
    
  );
};

export default NewPresenter;