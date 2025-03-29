import React, { useState, useEffect, useRef, useCallback } from "react";
import "./T20.css";
// import BetSection from "./RightSideBar";
import TournamentWinner from "./TournamentWinner";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";
import { OverMarketProvider, useOverMarket } from "../context/OverMarketContext";
import "react-toastify/dist/ReactToastify.css";
// import { useProfile } from '../context/ProfileContext';
import axios from 'axios'
import { ToastContainer, toast } from "react-toastify";

const socket = io(process.env.REACT_APP_BACKEND_URL);

const T20Content = () => {
  const [oddsData, setOddsData] = useState({});
  const [data, setData] = useState([]);
  const [fancyData, setFancyData] = useState([]);
  const [selectedBet, setSelectedBet] = useState({ label: "", odds: "", type: "", rate: "" });
  const [betData, setBetData] = useState([]);
  const [stakeValue, setStakeValue] = useState("");
  const [profit, setProfit] = useState(0);
  const [TournamentWinnerClicked, setTournamentWinnerClicked] = useState(false);
  const [NormalClicked, setNormalClicked] = useState(false);
  const [balance, setBalance] = useState(null);
  const [exposure, setExposure] = useState(null);
  const [team1Winnings, setTeam1Winnings] = useState(0);
  const [team2Winnings, setTeam2Winnings] = useState(0);
  const [betPopup, setBetPopup] = useState(null);


  const location = useLocation();
  const { id, iframeUrl, match } = location.state || {};

  const {
    overTeam1Winnings,
    overTeam2Winnings,
    overMarketBets,

  } = useOverMarket();
  useEffect(() => {
    if (!id) return;
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/odds?market_id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setOddsData(data);
      })
      .catch((err) => {
        console.error("Error fetching odds:", err);
      });

    socket.on("updateOdds", (updatedOdds) => {
      if (updatedOdds[id]) {
        setOddsData(updatedOdds[id]);
      }
    });

    return () => socket.off("updateOdds");
  }, [id]);

  const fetchAllData = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/cricket-market/getbets`);
      setBetData(response.data);
      console.log(response.data, "betData")
    } catch (err) {
      console.error("Error fetching odds:", err);
    }
  }, []);

  useEffect(() => {
    fetchAllData()
  }, [])

  const columnsT = ["Min: 100 Max: 25000", "Lgaai", "khaai",];
  const formattedMatchOdds = oddsData.matchOdds?.map((team) => [
    team.team_name,
    [
      (parseFloat(team.lgaai) * 100).toFixed(2),
      (parseFloat(team.lgaai) * 100).toFixed(2),
    ],
    [
      (parseFloat(team.khaai) * 100).toFixed(2),
      (parseFloat(team.khaai) * 100).toFixed(2),
    ],
  ]);

  useEffect(() => {
    setData(formattedMatchOdds || []);
  }, [oddsData]);

  const formattedFancyMarkets = oddsData.fancyMarkets?.map((market) => [
    market.session_name,
    [
      market.runsNo,
      (parseFloat(market.oddsNo) * 100).toFixed(2),
    ],
    [
      market.runsYes,
      (parseFloat(market.oddsYes) * 100).toFixed(2),
    ],
  ]);

  useEffect(() => {
    setFancyData(formattedFancyMarkets || []);
  }, [oddsData]);

  const columnstied = ["Min: 100 Max: 25000", "NO", "YES"];

  return (
    <>


      <div className="T20_container">
        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
          style={{ top: "12%", left: "50%", transform: "translate(-50%, -50%)", position: "fixed", zIndex: 9999 }}
        />
        <div className="left_side">
          <div className="T20_header">
            <h1>NEWS</h1>
          </div>

          <TournamentWinner
            title={"Match Odds"}
            columns={columnsT}
            data={data}
            setSelectedBet={setSelectedBet}
            profit={profit}
            betFor={selectedBet}
            stake={stakeValue}
            clicked={TournamentWinnerClicked}
            setTournamentWinnerClicked={setTournamentWinnerClicked}
            team1Winnings={team1Winnings}
            team2Winnings={team2Winnings}
            setExposure={setExposure}
            setBalance={setBalance}
          />

          <TournamentWinner
            title={"over market"}
            columns={columnstied}
            data={fancyData}
            setSelectedBet={(bet) => setSelectedBet({ ...bet, isOverMarket: true })}
            profit={profit}
            betFor={selectedBet}
            stake={stakeValue}
            clicked={NormalClicked}
            setTournamentWinnerClicked={setNormalClicked}
            team1Winnings={overTeam1Winnings}
            team2Winnings={overTeam2Winnings}
            setExposure={setExposure}
            setBalance={setBalance}
          />

          {/* <div className="mobile-view" ref={useRef(null)}>
            <BetSection
              selectedBet={selectedBet}
              stakeValue={stakeValue}
              setStakeValue={setStakeValue}
              profit={profit}
              isPaused={isPaused}
              setSelectedBet={setSelectedBet}
              setProfit={setProfit}
              handleSubmit={handleSubmit}
              myBets={allBets}
              setCurrentStake={setCurrentStake}
              stakeValues={[100, 200, 500, 1000, 2000, 5000, 10000, 15000, 20000, 25000]}
              currentBalance={balance}
              currentExposure={exposure}
            />
          </div> */}
        </div>

        {/* <div className="right_side">
          <BetSection
            selectedBet={selectedBet}
            stakeValue={stakeValue}
            setStakeValue={setStakeValue}
            profit={profit}
            isPaused={isPaused}
            setSelectedBet={setSelectedBet}
            setProfit={setProfit}
            handleSubmit={handleSubmit}
            myBets={allBets}
            setCurrentStake={setCurrentStake}
            stakeValues={[100, 200, 500, 1000, 2000, 5000, 10000, 15000, 20000, 25000]}
            currentBalance={balance}
            currentExposure={exposure}
          />
        </div> */}
      </div>


    </>
  );
};

const T20 = () => (
  <OverMarketProvider>
    <T20Content />
  </OverMarketProvider>
);

export default T20;