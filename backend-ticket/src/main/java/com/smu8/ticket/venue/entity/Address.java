package com.smu8.ticket.venue.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Embeddable
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Address {
    @Column(length = 20)
    private String zoneNo;
    @Column(length = 500)
    private String roadAddress;
    @Column(length = 500)
    private String jibunAddress;
    @Column(length = 500)
    private String detailAddress;
    @Column(length = 200)
    private String buildingName;
}
