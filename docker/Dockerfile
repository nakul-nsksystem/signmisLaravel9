# このファイルはPHPのサービスのみ影響します。
FROM php:8.1-fpm
RUN apt-get update && \
    apt-get install -y \
    git \
    wget \
    zip unzip p7zip-full libzip-dev \
    zlib1g-dev libpng-dev \
    libffi-dev libicu-dev \
    iputils-ping net-tools \
    && curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
    && rm -rf /var/lib/apt/lists/*

# [PHP] Enable Extensions
RUN docker-php-ext-install pdo_mysql
RUN docker-php-ext-enable pdo_mysql
#  RUN docker-php-ext-install ffi
#  RUN docker-php-ext-enable ffi
RUN docker-php-ext-install gd
RUN docker-php-ext-enable gd
RUN docker-php-ext-install intl
RUN docker-php-ext-enable intl
RUN docker-php-ext-install zip
RUN docker-php-ext-enable zip

# [PHP Pecl] Install mailperser 
RUN pecl install mailparse
RUN docker-php-ext-enable mailparse

# [PHP] Copy php.ini.
COPY ./user_php.ini /usr/local/etc/php/conf.d/user-php.ini

# [PHP] Install libs to install wkhtmltopdf
RUN apt-get update && \
    apt-get install -y \
    libfontconfig1 \
    libxrender1 \
    libxext6 \
    libssl-dev \
    libxrender-dev \
    libjpeg-dev \
    libpng-dev \
    libfreetype6-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    wget \
    xvfb \
    libicu-dev \
    libzip-dev \
    libpq-dev \
    git
RUN apt-get install -y fontconfig xfonts-75dpi

# [PHP] Install wkhtmltopdf
# RUN wget -q https://github.com/wkhtmltopdf/packaging/releases/download/0.12.6-1/wkhtmltox_0.12.6-1.stretch_amd64.deb && \
# 		dpkg -i wkhtmltox_0.12.6-1.stretch_amd64.deb && \
#     rm wkhtmltox_0.12.6-1.stretch_amd64.deb
RUN wget -q https://security.debian.org/debian-security/pool/updates/main/o/openssl/libssl1.1_1.1.1w-0+deb11u3_amd64.deb && \
    dpkg -i libssl1.1_1.1.1w-0+deb11u3_amd64.deb && \
    rm libssl1.1_1.1.1w-0+deb11u3_amd64.deb

RUN wget -q  https://github.com/wkhtmltopdf/packaging/releases/download/0.12.6.1-2/wkhtmltox_0.12.6.1-2.bullseye_amd64.deb && \
    dpkg -i wkhtmltox_0.12.6.1-2.bullseye_amd64.deb && \
    rm wkhtmltox_0.12.6.1-2.bullseye_amd64.deb


# [Fonts] Install NotoFonts

RUN apt-get install -y fonts-ipafont-gothic fonts-ipafont-mincho



#[install mysql cli]
RUN apt-get update && apt-get install -y default-mysql-client && rm -rf /var/lib/apt

#WORKDIR /var/www/html/SignMisWeb
