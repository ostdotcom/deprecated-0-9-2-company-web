class InitOst

  def self.matches?(request)
    if Rails.env.production?
      request.host == 'ost.com'
    elsif Rails.env.staging?
      request.host == 'stagingost.com'
    else
      request.host == 'developmentost.com'
    end
  end

end
