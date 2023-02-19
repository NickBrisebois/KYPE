import { TranslatorApp } from "./kype.translator";
import { ImageCache, CharacterMap } from "./interfaces";

// Resources
import "bootstrap/dist/css/bootstrap.min.css";
import character_mapping from "./character_mapping.json";
import "./css/style.css";

function main() {
  let character_mapping_list: CharacterMap[] = [];

  let letter_mappings = character_mapping.letters.map((m) => m as CharacterMap);
  character_mapping_list = character_mapping_list.concat(letter_mappings);

  let translator_app = new TranslatorApp(character_mapping_list, true);

  /* TEXT AREA HANDLERS */
  let supported_characters = character_mapping.letters.map((m) => m.char);
  let previous_translation_input: string[] = [];

  let translate_input_element: HTMLTextAreaElement = <HTMLTextAreaElement>(
    document.getElementById("translator-input")
  );
  translate_input_element.addEventListener(
    "keyup",
    (event) => {
      let chars = translate_input_element.value.split("");
      let pressed_key = event.key;

      // If backspace is hit, we pop the last drawn image off the list of drawn images
      if (event.code === "Backspace") {
        translator_app.handleBackspace();
        previous_translation_input = chars;
        return;
      }

      // only allow supported chars
      if (!supported_characters.includes(pressed_key)) {
        console.log(chars);
        translate_input_element.value = previous_translation_input.join("");
        return;
      }

      translator_app.handleTranslation(chars);
      previous_translation_input = chars;
    },
    false
  );
  translate_input_element.focus();

  /* RESET BUTTON HANDLERS - handles resetting the canvas and input box */
  let reset_button: HTMLButtonElement = <HTMLButtonElement>(
    document.getElementById("reset")
  );
  reset_button.addEventListener("click", () => {
    translator_app.reset();
    previous_translation_input = [];
    translate_input_element.value = "";
  });

  /* EXPORT BUTTON - handles exporting the contents of the canvas to a png */
  let export_button: HTMLButtonElement = <HTMLButtonElement>(
    document.getElementById("export")
  );
  export_button.addEventListener("click", () => {
    let image_string = translator_app.getCanvasAsImage();
    let hiddenLink = document.createElement("a");
    hiddenLink.href = image_string;
    hiddenLink.download = "kype_translation.png";
    document.body.appendChild(hiddenLink);
    hiddenLink.click();
    hiddenLink.remove();
  });
}

main();
