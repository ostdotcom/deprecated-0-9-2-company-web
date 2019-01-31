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

      def bt_to_ost_min
        0.00001
      end

      def bt_to_ost_step
        0.00001
      end

      def bt_to_ost_max
        500
      end

    end

  end

end
