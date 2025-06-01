class HomeController < ApplicationController
  def index
    inertia_render "Home", props: {
      message: "Hello from Rails! This is your Inertia-powered Home page."
    }
  end
end
