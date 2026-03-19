import Text "mo:core/Text";
import List "mo:core/List";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

actor {
  type Profile = {
    username : Text;
    phone : Text;
    balance : Nat;
    totalWon : Nat;
  };

  module Profile {
    public func compare(profile1 : Profile, profile2 : Profile) : Order.Order {
      Nat.compare(profile1.totalWon, profile2.totalWon);
    };
  };

  type Transaction = {
    timestamp : Time.Time;
    amount : Int;
    balanceAfter : Nat;
    description : Text;
  };

  type DepositRequest = {
    user : Principal;
    amount : Nat;
    contact : Text;
    timestamp : Time.Time;
  };

  type GameResult = {
    user : Principal;
    amountWon : Nat;
    timestamp : Time.Time;
    game : Text;
  };

  let profiles = Map.empty<Principal, Profile>();
  let transactions = Map.empty<Principal, List.List<Transaction>>();
  let depositRequests = Map.empty<Principal, List.List<DepositRequest>>();
  let gameResults = List.empty<GameResult>();

  public shared ({ caller }) func register(username : Text, phone : Text) : async () {
    if (profiles.containsKey(caller)) {
      Runtime.trap("User already registered");
    };
    let newProfile : Profile = {
      username;
      phone;
      balance = 1000;
      totalWon = 0;
    };
    profiles.add(caller, newProfile);
    transactions.add(caller, List.empty<Transaction>());
    depositRequests.add(caller, List.empty<DepositRequest>());
  };

  public shared ({ caller }) func addCoins(amount : Nat) : async () {
    switch (profiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) {
        let newBalance = profile.balance + amount;
        let updatedProfile = {
          username = profile.username;
          phone = profile.phone;
          balance = newBalance;
          totalWon = profile.totalWon;
        };
        profiles.add(caller, updatedProfile);
        let transactionsList = switch (transactions.get(caller)) {
          case (null) { List.empty<Transaction>() };
          case (?list) { list };
        };
        let transaction : Transaction = {
          timestamp = Time.now();
          amount = amount;
          balanceAfter = newBalance;
          description = "Deposit";
        };
        transactionsList.add(transaction);
        transactions.add(caller, transactionsList);
      };
    };
  };

  public query ({ caller }) func getBalance() : async Nat {
    switch (profiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) { profile.balance };
    };
  };

  public query ({ caller }) func getTransactions() : async [Transaction] {
    switch (transactions.get(caller)) {
      case (null) { [] };
      case (?list) { list.toArray() };
    };
  };

  public shared ({ caller }) func submitGameResult(game : Text, won : Bool, amount : Nat) : async Nat {
    switch (profiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) {
        let change : Int = if (won) { amount } else { -amount };
        let newBalance : Nat = if (change >= 0) {
          profile.balance + amount;
        } else {
          if (profile.balance < amount) { Runtime.trap("Insufficient balance") };
          profile.balance - amount;
        };
        let updatedProfile = {
          username = profile.username;
          phone = profile.phone;
          balance = newBalance;
          totalWon = if (won) { profile.totalWon + amount } else {
            profile.totalWon;
          };
        };
        profiles.add(caller, updatedProfile);
        let transaction : Transaction = {
          timestamp = Time.now();
          amount = change;
          balanceAfter = newBalance;
          description = game;
        };
        let transactionsList = switch (transactions.get(caller)) {
          case (null) { List.empty<Transaction>() };
          case (?list) { list };
        };
        transactionsList.add(transaction);
        transactions.add(caller, transactionsList);

        let result : GameResult = {
          user = caller;
          amountWon = amount;
          timestamp = Time.now();
          game;
        };
        if (won and amount >= 1000) {
          gameResults.add(result);
        };
        newBalance;
      };
    };
  };

  public shared ({ caller }) func requestDeposit(amount : Nat, contact : Text) : async () {
    if (not profiles.containsKey(caller)) {
      Runtime.trap("User not found");
    };
    let request : DepositRequest = {
      user = caller;
      amount;
      contact;
      timestamp = Time.now();
    };
    let requestsList = switch (depositRequests.get(caller)) {
      case (null) { List.empty<DepositRequest>() };
      case (?list) { list };
    };
    requestsList.add(request);
    depositRequests.add(caller, requestsList);
  };

  public query ({ caller }) func getTopPlayers() : async [Profile] {
    let profileArray = profiles.values().toArray();
    let sortedArray = profileArray.sort();
    let len = sortedArray.size();
    if (len <= 10) { return sortedArray };
    Array.tabulate(len, func(i) { sortedArray[i] }).sliceToArray(0, 10);
  };

  public query ({ caller }) func getRecentWins() : async [GameResult] {
    let allResults = gameResults.toArray();
    let resultsLen = allResults.size();
    let toTake = if (resultsLen < 10) { resultsLen } else { 10 };
    if (toTake == 0) {
      return [];
    };
    Array.tabulate(toTake, func(i) { allResults[i] });
  };
};
