# Pre Setup

* Install nginx
```bash
> brew install nginx
```

* Modify nginx config file
```
> vim /usr/local/etc/nginx/nginx.conf
    server {
        listen       8080;
        server_name  developmentost.com;
        
        location /api/ {
            proxy_pass http://developmentost.com:4001;
        }

        location / {
            proxy_pass http://developmentost.com:3001;
        }
    }
    server {
        listen       8080;
        server_name  kyc.developmentost.com;
        
        location /api/ {
            proxy_pass http://kyc.developmentost.com:4000;
        }

        location / {
            proxy_pass http://kyc.developmentost.com:3000;
        }
    }
    server {
        listen       8080;
        server_name  kit.developmentost.com;
        
        location /api/ {
            proxy_pass http://kit.developmentost.com:4001;
        }

        location / {
            proxy_pass http://kit.developmentost.com:3001;
        }
    }
    server {
        listen       8080;
        server_name  view.developmentost.com;

        location / {
            proxy_pass http://view.developmentost.com:3002;
        }
    }
    server {
        listen       8080;
        server_name  api.developmentost.com;

        location / {
            proxy_pass http://api.developmentost.com:3003;
        }
    }
> sudo nginx -s reload
```

* Add custom host
```
> sudo vim /etc/hosts

127.0.0.1       developmentost.com
127.0.0.1       kit.developmentost.com
127.0.0.1       kyc.developmentost.com
127.0.0.1       view.developmentost.com
127.0.0.1       api.developmentost.com
```

# Start Services

```
> bundle install
> source set_env_vars.sh
> rails s -p 3001
```

#Go to browser
http://developmentost.com:8080/


