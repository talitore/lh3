# frozen_string_literal: true

class HashEventPolicy < ApplicationPolicy
  def show?
    true
  end

  def create?
    user.present?
  end

  def update?
    user.present? && (record.creator == user)
  end

  def destroy?
    user.present? && (record.creator == user)
  end

  def create_photo?
    user.present? && (record.creator == user)
  end

  def permitted_attributes
    %i[run_number descriptor date time address]
  end

  class Scope < Scope
    def resolve
      scope.all
    end
  end
end








