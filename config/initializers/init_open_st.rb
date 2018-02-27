class InitOpenSt

  def self.matches?(request)
    if Rails.env.production?
      request.host == 'openst.org'
    elsif Rails.env.staging?
      request.host == 'stagingopenst.org'
    else
      request.host == 'developmentopenst.org'
    end
  end

end
