# frozen_string_literal: true

# Controller for the home page
class HomeController < ApplicationController
  def index
    render inertia: 'Home', props: {
      name: params.fetch(:name, 'World')
    }
  end
end
