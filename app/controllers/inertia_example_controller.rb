# frozen_string_literal: true

# Controller for demonstrating Inertia.js functionality
class InertiaExampleController < ApplicationController
  def index
    render inertia: 'InertiaExample', props: {
      name: params.fetch(:name, 'World')
    }
  end
end
