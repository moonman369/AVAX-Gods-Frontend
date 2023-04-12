import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context";
import { PageHOC } from "../components";

const Profile = () => {
  const navigate = useNavigate();
  const [participatedBattles, setParticipatedBattles] = useState();
  const { walletAddress, playerBattles } = useGlobalContext();

  useEffect(() => {
    if (walletAddress) {
      navigate(`/profile/${walletAddress}`);
    }
  }, [walletAddress]);

  useEffect(() => {
    if (playerBattles) setParticipatedBattles(playerBattles);
  }, [playerBattles]);

  return (
    <div>
      {participatedBattles?.length > 0 ? (
        participatedBattles.map((battle) => (
          <div className="text-white">{battle.name}</div>
        ))
      ) : (
        <div className="text-white">No battles found</div>
      )}
    </div>
  );
};

export default PageHOC(Profile, <>Player Profile</>);
