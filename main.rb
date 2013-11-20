require 'rubygems'
require 'sinatra'
require 'haml'
require 'json'
require 'pry'

set :sessions, true
START_POT = 500
BLACKJACK = 21
DEAL_MUST_STAY = 17

get '/' do 
    haml :main
end

get '/new_player' do
  session.clear
  haml :new_player
  # erb :play
end

post '/new_player' do
  session[:name] = params[:name]
  redirect '/bet'
end
 
get '/bet' do
  session[:money] ||= START_POT
  
  haml :bet
end

post '/bet_validate' do

  content_type 'application/json'

  if params[:bet].to_i > session[:money]
    { :validate => false }.to_json
  else
    { :validate => true }.to_json
  end
  
end

post '/bet' do
  session[:bet] = params[:bet].to_i
  session[:money] -= session[:bet]
  redirect '/prepare'
end
  

get '/prepare' do
    card_deck = [{ card: 'Ace', suit: :spades, value:  11 },
               { card: '2', suit: :spades, value: 2 },
               { card: '3', suit: :spades, value: 3 },
               { card: '4', suit: :spades, value: 4 },
               { card: '5', suit: :spades, value: 5 },
               { card: '6', suit: :spades, value: 6 },
               { card: '7', suit: :spades, value: 7 },
               { card: '8', suit: :spades, value: 8 },
               { card: '9', suit: :spades, value: 9 },
               { card: '10', suit: :spades, value: 10 },
               { card: 'Jack', suit: :spades, value: 10 },
               { card: 'Queen', suit: :spades, value: 10 },
               { card: 'King', suit: :spades, value: 10 },
               { card: 'Ace', suit: :hearts, value: 11 },
               { card: '2', suit: :hearts, value: 2 },
               { card: '3', suit: :hearts, value: 3 },
               { card: '4', suit: :hearts, value: 4 },
               { card: '5', suit: :hearts, value: 5 },
               { card: '6', suit: :hearts, value: 6 },
               { card: '7', suit: :hearts, value: 7 },
               { card: '8', suit: :hearts, value: 8 },
               { card: '9', suit: :hearts, value: 9 },
               { card: '10', suit: :hearts, value: 10 },
               { card: 'Jack', suit: :hearts, value: 10 },
               { card: 'Queen', suit: :hearts, value: 10 },
               { card: 'King', suit: :hearts, value: 10 },
               { card: 'Ace', suit: :diamonds, value: 11 },
               { card: '2', suit: :diamonds, value: 2 },
               { card: '3', suit: :diamonds, value: 3 },
               { card: '4', suit: :diamonds, value: 4 },
               { card: '5', suit: :diamonds, value: 5 },
               { card: '6', suit: :diamonds, value: 6 },
               { card: '7', suit: :diamonds, value: 7 },
               { card: '8', suit: :diamonds, value: 8 },
               { card: '9', suit: :diamonds, value: 9 },
               { card: '10', suit: :diamonds, value: 10 },
               { card: 'Jack', suit: :diamonds, value: 10 },
               { card: 'Queen', suit: :diamonds, value: 10 },
               { card: 'King', suit: :diamonds, value: 10 },
               { card: 'Ace', suit: :clubs, value: 11 },
               { card: '2', suit: :clubs, value: 2 },
               { card: '3', suit: :clubs, value: 3 },
               { card: '4', suit: :clubs, value: 4 },
               { card: '5', suit: :clubs, value: 5 },
               { card: '6', suit: :clubs, value: 6 },
               { card: '7', suit: :clubs, value: 7 },
               { card: '8', suit: :clubs, value: 8 },
               { card: '9', suit: :clubs, value: 9 },
               { card: '10', suit: :clubs, value: 10 },
               { card: 'Jack', suit: :clubs, value: 10 },
               { card: 'Queen', suit: :clubs, value: 10 },
               { card: 'King', suit: :clubs, value: 10 }
             ]

  card_deck.shuffle!
  player_hand = card_deck.shift(2)
  dealer_hand = card_deck.shift(2)
  dealer_hand.first[:show] = false
  dealer_hand_value = value(dealer_hand) - dealer_hand.first[:value] #compensate hidden card
  player_hand_value = value(player_hand)

  session[:deck] = card_deck
  session[:player_hand] = player_hand
  session[:dealer_hand] = dealer_hand
  session[:player_hand_value] = player_hand_value
  session[:dealer_hand_value] = dealer_hand_value
  session[:player_status] = :neutral
  session[:dealer_status] = :neutral

  if is_blackjack?(player_hand_value)
    session[:player_status] = :blackjack
  end

  if is_blackjack?(dealer_hand_value)
    session[:dealer_status] = :blackjack
  end

  redirect '/game'

end

get '/game' do

  if session[:player_status] == :blackjack
    @error = "Player blackjack"
    session[:money] += session[:bet]*2.5
  elsif session[:dealer_status] == :blackjack
    @error = "Dealer blackjack"
  elsif session[:player_status] == :blackjack && session[:dealer_status] == :blackjack
    session[:money] += session[:bet]
    @error = "Deal match"
  end
  
  check_winner

  haml :game
  # erb :game
end

post '/game/player/hit' do
  @card = session[:deck].shift
  session[:player_hand] << @card
  session[:player_hand_value] = value(session[:player_hand])
  check_winner
  haml :game, :layout => false 
  
end

post '/game/dealer/hit' do
  session[:dealer_hand] << session[:deck].first
  session[:dealer_hand_value] = value(session[:dealer_hand])
  check_winner
  haml :game, :layout => false 
end

post '/game/player/stay' do
  session[:player_status] = :stay
  session[:dealer_hand].first[:show] = true
  session[:dealer_hand_value] = value(session[:dealer_hand])

  redirect '/game'
end

helpers do
  def value(hand)
    aces = ace_number(hand)
    hand_value = hand.map { |s| s[:value] }.reduce(0, :+)
    aces.times { hand_value -= 10 if hand_value > 21 }
    return hand_value
  end

  def ace_number(hand)
    count = 0
    hand.each do |card|
     count = count + 1 if card[:card] == "Ace"
    end
    return count
  end

  def view(card)
    if card[:show] != false
      "<img src='/images/cards/#{card[:suit]}_#{card[:card].downcase}.jpg'>"
    else
      "<img src='/images/cards/cover.jpg'>"
    end
  end

  def is_blackjack?(value)
    return true if value == BLACKJACK
  end

  def check_winner
    if session[:player_hand_value] > BLACKJACK
      session[:player_status] = :busted
      @error = "Player Busted, dealer win"
    end

    if session[:dealer_hand_value] < DEAL_MUST_STAY
      session[:dealer_status] = :must_turn
    end

    if session[:dealer_hand_value].between?(DEAL_MUST_STAY,BLACKJACK)
      session[:dealer_status] = :must_stay
    end

    if session[:dealer_hand_value] > BLACKJACK
      session[:dealer_status] = :busted
      session[:money] += session[:bet]*2
      @error = "Dealer Busted, player win"
    end

    if session[:dealer_status] == :must_stay && session[:player_status] == :stay
      if session[:player_hand_value] >= session[:dealer_hand_value]
        session[:money] += session[:bet]*2
        @error = "Player Win"
      else
        @error = "Dealer Win"
      end
    end
  end

end