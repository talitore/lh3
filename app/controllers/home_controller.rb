# frozen_string_literal: true

# Controller for the home page
class HomeController < ApplicationController
  ##
  # Renders the Home page using Inertia.js, passing a `name` prop from request parameters or defaulting to 'World'.
  # @return [void]
  def index
    render inertia: "Home", props: {
      name: params.fetch(:name, "World")
    }
  end
end
