import { ethers } from "ethers";
import { ABI } from "../contract";
import { playAudio, sparcle } from "../utils/animation.js";
import { attackSound, defenseSound } from "../assets";
import { useNavigate } from "react-router-dom";

export const nullAddress = "0x0000000000000000000000000000000000000000";

export const AddNewEvent = (eventFilter, provider, cb) => {
  provider.removeListener(eventFilter);

  provider.on(eventFilter, (logs) => {
    const parsedLog = new ethers.utils.Interface(ABI).parseLog(logs);

    cb(parsedLog);
  });
};

const getCoords = (cardRef) => {
  const { left, top, width, height } = cardRef.current.getBoundingClientRect();
  return {
    pageX: left + width / 2,
    pageY: top + height / 2.25,
  };
};

const createEventListeners = ({
  navigate,
  contract,
  provider,
  walletAddress,
  setShowAlert,
  setUpdateGameData,
  player1Ref,
  player2Ref,
  gameData,
  setGameData,
}) => {
  const NewPlayerEventFilter = contract.filters.NewPlayer();

  AddNewEvent(NewPlayerEventFilter, provider, ({ args }) => {
    console.log("New player created!", args);
    if (walletAddress === args.owner) {
      setShowAlert({
        status: true,
        type: "success",
        message: "Player has been successfully summoned!",
      });
    }
  });

  const NewBattleEventFilter = contract.filters.NewBattle();

  AddNewEvent(NewBattleEventFilter, provider, ({ args }) => {
    console.log("New battle started", args, walletAddress);

    if (
      walletAddress.toLowerCase() === args.player1.toLowerCase() ||
      walletAddress.toLowerCase() === args.player2.toLowerCase()
    ) {
      navigate(`/battle/${args.battleName}`);
      setUpdateGameData((prevUpdateGameData) => prevUpdateGameData + 1);
    }
  });

  const NewGameTokenEventFilter = contract.filters.NewGameToken();

  AddNewEvent(NewGameTokenEventFilter, provider, ({ args }) => {
    console.log("New game token created", args);

    if (walletAddress.toLowerCase() === args.owner.toLowerCase()) {
      setShowAlert({
        status: true,
        type: "success",
        message: "Player game token has been succesfully created",
      });

      navigate("/create-battle");
    }
  });

  const BattleMoveEventFilter = contract.filters.BattleMove();
  AddNewEvent(BattleMoveEventFilter, provider, ({ args }) => {
    console.log("Battle move initiated", args);
    setUpdateGameData((prevUpdateGameData) => prevUpdateGameData + 1);
  });

  const RoundEndedEventFilter = contract.filters.RoundEnded();
  AddNewEvent(RoundEndedEventFilter, provider, ({ args }) => {
    console.log("Round ended", args, walletAddress);
    for (let i = 0; i < args.damagedPlayers.length; i++) {
      if (args.damagedPlayers[i] !== nullAddress) {
        if (args.damagedPlayers[i].toLowerCase() === walletAddress) {
          sparcle(getCoords(player1Ref));
        } else if (args.damagedPlayers[i].toLowerCase() !== walletAddress) {
          sparcle(getCoords(player2Ref));
        }
      } else {
        playAudio(defenseSound);
      }
    }

    // setUpdateGameData((prevUpdateGameData) => prevUpdateGameData + 1);
  });

  const BattleEndedEventFilter = contract.filters.BattleEnded();

  AddNewEvent(BattleEndedEventFilter, provider, ({ args }) => {
    console.log("Battle ended!", args, walletAddress);

    if (walletAddress.toLowerCase() === args.winner.toLowerCase()) {
      setShowAlert({
        status: true,
        type: "success",
        message: "VICTORY IS YOURS!",
      });
    } else if (walletAddress.toLowerCase() === args.loser.toLowerCase()) {
      setShowAlert({
        status: true,
        type: "failure",
        message: "DEFEAT",
      });
    }

    navigate(`/battle-summary/${args.battleName}`);
  });
};

export default createEventListeners;
