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
> sudo nginx -s reload
```

* Add custom host
```
> sudo vim /etc/hosts

127.0.0.1       developmentost.com
```

# Start Services

```
> bundle install
> source set_env_vars.sh
> rails s -p 3000
```

#Go to browser
http://kit.developmentost.com:8080/login


