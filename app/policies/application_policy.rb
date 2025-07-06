# frozen_string_literal: true

class ApplicationPolicy
  attr_reader :user, :record

  ##
  # Initializes the policy with the given user and record for authorization checks.
  # @param user The user performing the action.
  # @param record The resource being authorized.
  def initialize(user, record)
    @user = user
    @record = record
  end

  ##
  # Returns false, indicating that listing records is not permitted by default.
  # @return [Boolean] Always returns false.
  def index?
    false
  end

  ##
  # Determines whether the user is permitted to view the record.
  # @return [Boolean] Always returns false, denying access by default.
  def show?
    false
  end

  ##
  # Returns false, indicating that creation is not permitted by default.
  # Subclasses should override this method to define creation permissions.
  def create?
    false
  end

  ##
  # Checks if the user is permitted to create a new record.
  # Delegates to the `create?` method for permission logic.
  # @return [Boolean] Whether creating a new record is allowed.
  def new?
    create?
  end

  ##
  # Determines whether the user is permitted to update the record.
  # @return [Boolean] Always returns false, indicating update is not allowed by default.
  def update?
    false
  end

  ##
  # Checks if the user is permitted to edit the record.
  # Delegates to the `update?` method for permission logic.
  # @return [Boolean] Whether editing is allowed.
  def edit?
    update?
  end

  ##
  # Determines whether the user is permitted to destroy the record.
  # @return [Boolean] Always returns false, denying destroy permission by default.
  def destroy?
    false
  end

  ##
  # Returns an array of attributes permitted for mass assignment.
  # By default, returns an empty array. Intended to be overridden in subclasses to specify permitted attributes.
  # @return [Array] The list of permitted attribute names.
  def permitted_attributes
    []
  end

  class Scope
    ##
    # Initializes a new Scope instance with the given user and scope.
    # @param user The user for whom the scope is being defined.
    # @param scope The collection or resource to be scoped.
    def initialize(user, scope)
      @user = user
      @scope = scope
    end

    ##
    # Raises an error to enforce that subclasses must implement the `resolve` method for scoping records.
    # @raise [NoMethodError] Always raised to indicate the method must be overridden.
    def resolve
      raise NoMethodError, "You must define #resolve in #{self.class}"
    end

    private

    attr_reader :user, :scope
  end
end
