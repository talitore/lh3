# frozen_string_literal: true

# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require_relative "config/application"

Rails.application.load_tasks

if defined?(RuboCop)
  require "rubocop/rake_task"
  RuboCop::RakeTask.new

  task default: %i[rubocop:autocorrect]
end

# Update js-routes file before javascript build
task "assets:precompile" => "js:routes"
