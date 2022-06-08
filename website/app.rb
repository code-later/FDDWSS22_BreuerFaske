require 'sinatra'
require 'sinatra/reloader' if development?

set :haml, :format => :html5

get '/' do
  haml :index
end
