# frozen_string_literal: true

class SpaController < ApplicationController
  before_action :authenticate_user!

  def index
    render layout: "application"
  end
end
