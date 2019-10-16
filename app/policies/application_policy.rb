class ApplicationPolicy
  attr_reader :user, :record

  def initialize(user, record)
    raise Pundit::NotAuthorizedError, "must be logged in" unless user
    @user = user
    @record = record
  end

  def index?
    @user.has_role? :super_admin 
  end

  def show?
    @user.has_role? :super_admin 
  end

  def create?
    @user.has_role? :super_admin 
  end

  def new?
    create?
  end

  def update?
    @user.has_role? :super_admin 
  end

  def edit?
    update?
  end

  def destroy?
    @user.has_role? :super_admin 
  end

  class Scope
    attr_reader :user, :scope

    def initialize(user, scope)
      @user = user
      @scope = scope

      @account_access = AccountUser.find_by_user_id(@user.id) if @user.present?

    end

    def resolve
      scope.all
    end
  end
end
