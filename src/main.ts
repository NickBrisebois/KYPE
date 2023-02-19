import { TranslatorApp } from "./kype.translator";
import { ImageCache, CharacterMap } from "./interfaces";

// Resources
import character_mapping from "./character_mapping.json";
import "./css/style.css";

function main() {
  let character_mapping_list: CharacterMap[] = [];

  let letter_mappings = character_mapping.letters.map((m) => m as CharacterMap);
  character_mapping_list = character_mapping_list.concat(letter_mappings);

  let translator_app = new TranslatorApp(character_mapping_list);

  /* TEXT AREA HANDLERS */
  let supported_characters = character_mapping.letters.map((m) => m.char);
  let previous_translation_input: string[] = [];

  let translate_input_element: HTMLTextAreaElement = <HTMLTextAreaElement>(
    document.getElementById("translator-input")
  );
  translate_input_element.addEventListener(
    "keyup",
    () => {
      let chars = translate_input_element.value.split("");

      // only allow supported chars
      if (!supported_characters.includes(chars[chars.length - 1])) {
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

  /* RESET BUTTON HANDLERS */
  let reset_button: HTMLButtonElement = <HTMLButtonElement>(
    document.getElementById("reset")
  );
  reset_button.addEventListener("click", () => {
    translator_app.reset();
    previous_translation_input = [];
    translate_input_element.value = "";
  });
}

main();
