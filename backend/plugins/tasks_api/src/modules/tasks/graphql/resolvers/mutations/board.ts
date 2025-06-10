
import { IBoard } from "~/modules/tasks/@types/board";
import { IPipeline } from "~/modules/tasks/@types/pipeline";
import { IStage, IStageDocument } from "~/modules/tasks/@types/stage";
import { configReplacer } from "~/modules/tasks/utils";



interface IBoardsEdit extends IBoard {
    _id: string;
  }
  
  interface IPipelinesAdd extends IPipeline {
    stages: IStageDocument[];
  }
  
  interface IPipelinesEdit extends IPipelinesAdd {
    _id: string;
  }
  
  interface IStageEdit extends IStage {
    _id: string;
  }
  
  const checkNumberConfig = async (numberConfig: string, numberSize: string) => {
    if (!numberConfig) {
      throw new Error("Please input number configuration.");
    }
  
    if (!numberSize) {
      throw new Error("Please input fractional part.");
    }
  
    const replaced = await configReplacer(numberConfig);
    const re = /[0-9]$/;
  
    if (re.test(replaced)) {
      throw new Error(
        `Please make sure that the number configuration itself doesn't end with any number.`
      );
    }
  
    return;
  };
  