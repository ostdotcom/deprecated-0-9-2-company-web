module GlobalConstant

  class ClientToken < GlobalConstant::Base

    class << self


      def not_deployed
        'notDeployed'
      end

      def deployment_started
        'deploymentStarted'
      end

      def deployment_completed
        'deploymentCompleted'
      end

      def deployment_failed
        'deploymentFailed'
      end

    end

  end

end
